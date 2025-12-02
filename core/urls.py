from django.urls import path
from . import views

urlpatterns = [
    path('', views.LandingPage.as_view(), name='landing'),
    path('login/', views.LoginPage.as_view(), name='login'),
]
