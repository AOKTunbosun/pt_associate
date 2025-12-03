from django.shortcuts import render
from django.views import View

# Create your views here.

class LandingPage(View):
    def get(self, request):
        
        context = {}
        return render(request, 'core/landing.html', context)
    

class LoginPage(View):
    def get(self, request):

        context = {}
        return render(request, 'core/login.html', context)
    
    def post(self, request):
        print(request.POST.get('email'))
        context = {}
        return render(request, 'core/login.html', context)



class SignupPage(View):
    def get(self, request):
        context = {}
        return render(request, 'core/signup.html', context)
    
    def post(self, request):
        print(request.POST.get('firstName'))
        context = {}
        return render(request, 'core/signup.html', context)