from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from django.contrib.auth.decorators import login_required
from django.contrib import messages
import uuid

# Create your views here.
User = get_user_model()


# @method_decorator(ratelimit(key='ip', rate='3/m', method='GET'), name='dispatch')
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
            return redirect('dashboard')

            
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
        if request.user.is_authenticated:
            logout(request)

        first_name = request.POST.get('firstName')
        last_name = request.POST.get('lastName')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password = request.POST.get('password')

        username = email.split('@')[0] + str(uuid.uuid4())[:10]

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exist')
            return redirect('signup')
        
        try:
            user = User.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                username=username,
                email=email,
                phone_number=phone,
                password=password
            )

            if user:
                login(request, user)
                return redirect('dashboard')
        
        except Exception as e:
            print(e)
            messages.error(request, 'Error trying to create your account')
            return redirect('signup')


class DashboardPage(View):

    @method_decorator(login_required)
    def get(self, request):
        context = {}
        return render(request, 'core/dashboard.html', context)