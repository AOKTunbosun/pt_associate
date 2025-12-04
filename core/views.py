from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib import messages

# Create your views here.
User = get_user_model()


class LandingPage(View):
    def get(self, request):
        
        context = {}
        return render(request, 'core/landing.html', context)
    

class LoginPage(View):
    def get(self, request):

        context = {}
        return render(request, 'core/login.html', context)
    
    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
        
        email = request.POST.get('email').strip()
        password = request.POST.get('password').strip()
        remember = request.POST.get('remember')

        try:
            user = User.objects.get(email=email)
            
        except User.DoesNotExist:
            messages.error(request, message='User does not exist, try signing up')
            return redirect('login')
        
        except User.MultipleObjectsReturned:
            messages.error(request, message='Multiple accounts found for this email')
            return redirect('login')

        user = authenticate(request, username=user.username, password=password)


        if user is not None:
            if not remember:
                request.session.set_expiry(0)
            else:
                request.session.set_expiry(60*60*24*30)
            login(request, user)
            return redirect('landing')

            
        else:
            messages.error(request, message='Incorrect password')
            return redirect('login')


def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect('login')


class SignupPage(View):
    def get(self, request):
        context = {}
        return render(request, 'core/signup.html', context)
    
    def post(self, request):
        print(request.POST.get('firstName'))
        context = {}
        return render(request, 'core/signup.html', context)

