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
        
        except:
            messages.error(request, message='User does not exist, try signing up')
            return redirect('login')
        
        user = authenticate(request, email=email, password=password)


        if not user:
            messages.error(request, message='Incorrect password')
            return redirect('login')

        else:
            login(request, user)
            if not remember:
                request.session.set_expiry(0)
            else:
                request.session.set_expiry(60*60*24*30)
            return redirect('login')


class SignupPage(View):
    def get(self, request):
        context = {}
        return render(request, 'core/signup.html', context)
    
    def post(self, request):
        print(request.POST.get('firstName'))
        context = {}
        return render(request, 'core/signup.html', context)

