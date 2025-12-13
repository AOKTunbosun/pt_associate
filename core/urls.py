from django.urls import path
from . import views

urlpatterns = [
    path('', views.LandingPage.as_view(), name='landing'),
    path('login/', views.LoginPage.as_view(), name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('signup/', views.SignupPage.as_view(), name='signup'),
    path('dashboard/', views.DashboardPage.as_view(), name='dashboard'),
    path('messages/', views.MessagesPage.as_view(), name='messages')
]
