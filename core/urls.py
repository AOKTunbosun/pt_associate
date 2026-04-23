from django.urls import path
from . import views

urlpatterns = [
    path('', views.LandingPage.as_view(), name='landing'),
    path('login/', views.LoginPage.as_view(), name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('signup/', views.SignupPage.as_view(), name='signup'),
    path('dashboard/', views.DashboardPage.as_view(), name='dashboard'),
    path('parent-dashboard/', views.ParentDashboardPage.as_view(),
         name='parent-dashboard'),
    path('teacher-dashboard/', views.TeacherDashboardPage.as_view(),
         name='teacher-dashboard'),
    path('principal-dashboard/', views.PrincipalDashboardPage.as_view(),
         name='principal-dashboard'),
    path('add-staff/', views.AddStaffPage.as_view(), name='add-staff'),
    path('create-classroom/', views.CreateClassroom.as_view(), name='create-classroom'),
    path('classrooms/', views.ClassroomList.as_view(), name='classroom-list'),
    path('messages/', views.MessagesPage.as_view(), name='messages')
]
