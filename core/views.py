from datetime import datetime
from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.db import IntegrityError
from django.db.models import Count

from datetime import datetime
import uuid

from .models import (Institution,
                     Staff,
                     Classroom,
                     Student)

# Create your views here.
User = get_user_model()


class LandingPage(View):
    # @method_decorator(ratelimit(key='ip', rate='3/m', method='GET', block=True), name='dispatch')
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
            messages.error(
                request, message='User does not exist, try signing up')
            return redirect('login')

        except User.MultipleObjectsReturned:
            messages.error(
                request, message='Multiple accounts found for this email')
            return redirect('login')

        user = authenticate(request, username=user.username, password=password)

        if user is not None:
            if not remember:
                request.session.set_expiry(0)
            else:
                request.session.set_expiry(60*60*24*30)

            if user.is_principal == True:
                login(request, user)
                return redirect('principal-dashboard')

            # elif user.is_burser == True:
            #     pass

            elif user.is_parent == True:
                login(request, user)
                return redirect('parent-dashboard')

            elif user.is_teacher == True:
                login(request, user)
                return redirect('teacher-dashboard')

            # login(request, user)
            # return redirect('dashboard')

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

        if request.POST.get('form_type') == 'individual':

            first_name = request.POST.get('firstName')
            last_name = request.POST.get('lastName')
            email = request.POST.get('email')
            phone = request.POST.get('phone')
            account_type = request.POST.get('accountType')
            gender = request.POST.get('gender')
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
                    gender=gender,
                    password=password,
                    is_parent=True if account_type == 'parent' else False,
                    is_teacher=True if account_type == 'teacher' else False,
                )

                if user and account_type == 'parent':
                    # html_content = render_to_string('emails/welcome.html', {'user': user})
                    # send_mail(subject='Welcome to PT-Associate',
                    #           message='Your parent account has been created',
                    #           from_email=None,
                    #           recipient_list=[user.email],
                    #           html_message=html_content)
                    login(request, user)
                    return redirect('parent-dashboard')

                elif user and account_type == 'teacher':
                    # html_content = render_to_string('emails/welcome.html', {'user': user})
                    # send_mail(subject='Welcome to PT-Associate',
                    #           message='Your teacher account has been created',
                    #           from_email=None,
                    #           recipient_list=[user.email],
                    #           html_message=html_content)
                    login(request, user)
                    return redirect('teacher-dashboard')

            except Exception as e:
                print(e)
                messages.error(request, 'Error trying to create your account')
                return redirect('signup')

        elif request.POST.get('form_type') == 'institution':
            institution_name = request.POST.get('institutionName')
            institution_principal_email = request.POST.get('institutionEmail')
            institution_type = request.POST.get('institutionType')
            location = request.POST.get('location')
            institution_principal_password = request.POST.get(
                'institutionPassword')

            try:
                user = User.objects.get(email=institution_principal_email)

            except User.DoesNotExist:
                messages.error(
                    request, message='User does not exist, try signing up')
                return redirect('signup')

            except User.MultipleObjectsReturned:
                messages.error(
                    request, message='Multiple accounts found for this email')
                return redirect('signup')

            user = authenticate(request, username=user.username,
                                password=institution_principal_password)

            if user is not None:
                if user.is_teacher and not user.is_parent:

                    try:
                        school = Institution.objects.create(
                            institution_name=institution_name,
                            principal=user,
                            institution_type=institution_type,
                            location=location
                        )

                        if school:
                            login(request, user)
                            return redirect('principal-dashboard')

                    except Exception as e:
                        print(e)
                        messages.error(
                            request, 'Error trying to create your school account')
                        return redirect('signup')

                else:
                    messages.error(
                        request, 'Principal must be a teacher account')
                    return redirect('signup')

            else:
                messages.error(request, message='Incorrect password')
                return redirect('signup')


class DashboardPage(View):

    @method_decorator(login_required)
    def get(self, request):
        context = {}
        return render(request, 'core/dashboard.html', context)


class ParentDashboardPage(View):
    @method_decorator(login_required)
    def get(self, request):
        context = {}
        return render(request, 'core/parent_dashboard.html', context)


class TeacherDashboardPage(View):
    @method_decorator(login_required)
    def get(self, request):
        context = {}
        return render(request, 'core/teacher_dashboard.html', context)


class PrincipalDashboardPage(View):
    @method_decorator(login_required)
    def get(self, request):

        context = {}
        return render(request, 'core/principal_dashboard.html', context)


class AddStaffPage(View):
    @method_decorator(login_required)
    def get(self, request):
        context = {}
        return render(request, 'core/add_staff.html', context)

    def post(self, request):
        if request.user.is_principal:

            teacher_email = request.POST.get('email').strip()

            try:
                user = User.objects.get(email=teacher_email)

                institution = Institution.objects.get(principal=request.user)

                staff = Staff.objects.create(
                    institution=institution, staff=user)

                # html_content = render_to_string('emails/add_staff.html', {'institution': institution})
                # send_mail(subject=f'PT-Associate: Added as a staff of {institution.institution_name}',
                #     message=f'You have been added as a staff of {institution.institution_name}',
                #     from_email=None,
                #     recipient_list=[teacher_email],
                #     html_message=html_content
                #     )

                messages.success(
                    request, f'Account have been added as a staff of {institution.institution_name}')
                return redirect('add-staff')

            except IntegrityError:
                messages.error(
                    request, 'Teacher is already a staff of the school')
                return redirect('add-staff')

            except Institution.DoesNotExist:
                messages.error(
                    request, 'You do not have a principal account, create your institution before adding staff')
                return redirect('add-staff')

            except User.DoesNotExist:
                # html_content = render_to_string('emails/invite_staff.html')

                # send_mail(subject='PT-Associate Invite',
                #           message='You have been invited to signup with PT-Associate as a teacher',
                #           from_email=None,
                #           recipient_list=[teacher_email],
                #           html_message=html_content
                #           )

                messages.success(
                    request, f'Invite has been sent to {teacher_email}')
                return redirect('add-staff')

        else:
            messages.error(
                request, 'You do not have a principal account, create your instituion before adding staff')
            return redirect('signup')


class CreateClassroom(View):
    @method_decorator(login_required)
    def get(self, request):
        institution = Institution.objects.get(principal=request.user)

        staff_members = institution.institution_staff.select_related('staff')

        context = {'institution': institution, 'staffs': staff_members}
        return render(request, 'core/create_classroom.html', context)

    @method_decorator(login_required)
    def post(self, request):
        class_name = request.POST.get('class_name')
        class_code = request.POST.get('class_code')
        academic_session = request.POST.get('academic_session')
        class_teacher_id = request.POST.get('class_teacher')

        try:
            teacher = User.objects.get(id=class_teacher_id)
            institution = Institution.objects.get(principal=request.user.id)
            staff = Staff.objects.get(staff=teacher, institution=institution)

        except User.DoesNotExist:
            messages.error(
                request, message='User does not exist')
            return redirect('create-classroom')

        except Institution.DoesNotExist:
            messages.error(
                request, message='Institution does not exist'
            )
            return redirect('create-classroom')

        except Staff.DoesNotExist:
            messages.error(
                request, message='Teacher is not a staff of your institution, add as staff first'
            )
            return redirect('create-classroom')

        Classroom.objects.create(classroom_name=class_name,
                                 classroom_code=class_code,
                                 academic_session=academic_session,
                                 teacher=teacher,
                                 institution=institution)

        messages.success(
            request, message='Classroom created successfully'
        )
        return redirect('create-classroom')


class ClassroomList(View):
    @method_decorator(login_required)
    def get(self, request):
        try:
            institution = Institution.objects.get(principal=request.user)
            classrooms = Classroom.objects.filter(
                institution=institution).annotate(student_count=Count('students'))
        except Classroom.DoesNotExist:
            classrooms = None

        context = {'classrooms': classrooms}
        return render(request, 'core/classroom_list.html', context)

    @method_decorator(login_required)
    def post(self, request):
        pass


class MessagesPage(View):
    @method_decorator(login_required)
    def get(self, request):
        return render(request, 'core/messages.html')


class CreateStudent(View):
    @method_decorator(login_required)
    def get(self, request):
        try:
            classroom = Classroom.objects.get(teacher=request.user)

        except Classroom.DoesNotExist:
            classroom = None

        context = {'classroom': classroom}
        return render(request, 'core/create_student.html', context)

    @method_decorator(login_required)
    def post(self, request):
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        middle_name = request.POST.get('middle_name')
        date_of_birth = request.POST.get('date_of_birth')
        gender = request.POST.get('gender')
        parent_email = request.POST.get('parent_email')

        # Get parent and classroom3 record
        try:
            parent = User.objects.get(email=parent_email)
            classroom = Classroom.objects.get(teacher=request.user)

        except User.DoesNotExist:

            html_content = render_to_string('emails/invite_parent.html')

            send_mail(subject='PT-Associate Invite',
                      message='You have been invited to signup with PT-Associate as a parent',
                      from_email=None,
                      recipient_list=[parent_email],
                      html_message=html_content
                      )

            messages.success(
                request, message='Invitation link has been sent to parent')
            parent = None

        except Classroom.DoesNotExist:
            messages.error(
                request, message='Classroom does not exist'
            )
            return redirect('create-student')

        dob = datetime.strptime(date_of_birth, '%Y-%m-%d').date()

        Student.objects.create(
            first_name=first_name,
            last_name=last_name,
            middle_name=middle_name if middle_name is not None else None,
            date_of_birth=dob,
            gender=gender,
            parent=parent if parent is not None else None,
            classroom=classroom
        )

        messages.success(
            request, message='Student record created successfully'
        )
        return redirect('create-student')
