from datetime import datetime
from django.shortcuts import render, redirect, get_object_or_404
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
from django.db.models import Q
from django.http import HttpResponse

from datetime import datetime, date
import uuid

from .models import (Institution,
                     Staff,
                     Classroom,
                     Student,
                     Conversation,
                     Message,
                     Announcement)

from core.services.chat_broadcast import broadcast_message
from .forms import MessageForm
from core.services.messages import create_message

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
        remember = request.POST.get('remember_me')

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

            elif user.is_burser == True:
                login(request, user)
                return redirect('bursar-dashboard')

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

            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')
            email = request.POST.get('email')
            phone = request.POST.get('phone')
            account_type = request.POST.get('account_type')
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
            institution_name = request.POST.get('institution_name')
            institution_principal_email = request.POST.get('principal_email')
            institution_type = request.POST.get('institution_type')
            location = request.POST.get('location')
            institution_principal_password = request.POST.get(
                'principal_password')

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


@method_decorator(login_required, name='dispatch')
class ParentDashboardPage(View):
    @method_decorator(login_required)
    def get(self, request):
        children = Student.objects.filter(parent=request.user)
        children_classes = children.values_list(
            "classroom_id",
            flat=True
        )
        announcements = Announcement.objects.filter(
            Q(role__in=["principal", "bursar"]) |
            Q(
                role="teacher",
                assigned_class_id__in=children_classes
            )
        ).distinct().order_by("-created_at")[:5]

        context = {'children': children, 'announcements': announcements}
        return render(request, 'core/parent_dashboard.html', context)


@method_decorator(login_required, name='dispatch')
class TeacherDashboardPage(View):
    @method_decorator(login_required)
    def get(self, request):
        classroom = Classroom.objects.get(teacher=request.user)
        students = Student.objects.filter(classroom=classroom).all()

        context = {
            'total_students': len(students),
            'my_class': classroom
        }
        return render(request, 'core/teacher_dashboard.html', context)


@method_decorator(login_required, name='dispatch')
class PrincipalDashboardPage(View):
    @method_decorator(login_required)
    def get(self, request):
        institution = Institution.objects.get(principal=request.user)
        classrooms = institution.classrooms.all()
        staff = institution.institution_staff.all()
        announcements = Announcement.objects.filter(author=request.user).order_by("-created_at")[:5]

        students = []
        for classroom in classrooms:
            for student in classroom.students.all():
                students.append(student)
        
        announcements_list = []
        for each in announcements:
            announcement = {
                'id': each.id,
                'title': each.title,
                'message': each.body,
                'created_at': datetime.strptime(str(each.created_at.date()), '%Y-%m-%d').date(),
            }
            announcements_list.append(announcement)

        context = {
            'total_number_of_students': len(students),
            'number_of_classrooms': len(classrooms),
            'classrooms': classrooms,
            'total_staff': len(staff),
            'institution': institution,
            'announcements': announcements_list
        }
        return render(request, 'core/principal_dashboard.html', context)


@method_decorator(login_required, name='dispatch')
class BursarDashboardPage(View):
    @method_decorator(login_required)
    def get(self, request):
        institution = Institution.objects.get(burser=request.user)
        classrooms = institution.classrooms.all()
        announcements = Announcement.objects.filter(author=request.user).order_by("-created_at")[:5]

        parents = []
        students = []
        for classroom in classrooms:
            for student in classroom.students.all():
                students.append(student)
                
                if student.parent:
                    parents.append(student.parent)
        
        announcements_list = []
        for each in announcements:
            announcement = {
                'id': each.id,
                'title': each.title,
                'message': each.body,
                'created_at': datetime.strptime(str(each.created_at.date()), '%Y-%m-%d').date(),
            }
            announcements_list.append(announcement)

        context = {
            'total_students': len(students),
            'total_parents': len(parents),
            'total_classes': len(classrooms),
            'announcements': announcements_list
        }
        return render(request, 'core/bursar_dashboard.html', context)


@method_decorator(login_required, name='dispatch')
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


@method_decorator(login_required, name='dispatch')
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


@method_decorator(login_required, name='dispatch')
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


@method_decorator(login_required, name='dispatch')
class MessagesPage(View):

    def get(self, request, conversation_uid=None):

        conversations = Conversation.objects.filter(
            parent=request.user
        ) | Conversation.objects.filter(
            teacher=request.user
        )

        conversation = None
        messages = []

        if conversation_uid:
            conversation = get_object_or_404(
                Conversation,
                uid=conversation_uid
            )

            if request.user not in [conversation.parent, conversation.teacher]:
                return HttpResponse(status=403)

            messages = conversation.messages.all()

        context = {
            "conversations": conversations,
            "conversation": conversation,
            "active_uid": conversation.uid if conversation else None,
            "messages": messages,
            "current_user": request.user,
            "form": MessageForm()
        }

        return render(request, "core/messages.html", context)


@method_decorator(login_required, name='dispatch')
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

        # Get parent and classroom record
        try:
            classroom = Classroom.objects.get(teacher=request.user)
            print(classroom)
            parent = User.objects.get(email=parent_email)

        except User.DoesNotExist:

            html_content = render_to_string('emails/invite_parent.html')

            # send_mail(subject='PT-Associate Invite',
            #           message='You have been invited to signup with PT-Associate as a parent',
            #           from_email=None,
            #           recipient_list=[parent_email],
            #           html_message=html_content
            #           )

            messages.success(
                request, message='Invitation link has been sent to parent')
            parent = None

        except Classroom.DoesNotExist:
            messages.error(
                request, message='Classroom does not exist'
            )
            return redirect('student-list')

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
        return redirect('student-list')


@method_decorator(login_required, name='dispatch')
class StudentList(View):
    def get(self, request):
        classroom = Classroom.objects.prefetch_related(
            'students').get(teacher=request.user)
        students = classroom.students.all()

        students_list = []
        for each in students:
            student = {
                'id': each.id,
                'first_name': each.first_name,
                'last_name': each.last_name,
                'full_name': f'{each.first_name} {each.last_name}',
                'date_of_birth': each.date_of_birth,
                'gender': each.gender.capitalize(),
                # Calculate age based on date of birth, accounting for whether the birthday has occurred this year
                'age': (date.today().year - each.date_of_birth.year) - 1 if (date.today().month, date.today().day) < (each.date_of_birth.month, each.date_of_birth.day) else (date.today().year - each.date_of_birth.year),
                'parent_email': each.parent.email if each.parent is not None else None,
                'parent_name': f'{each.parent.first_name} {each.parent.last_name}' if each.parent is not None else None,
                'parent_linked': True if each.parent is not None else False,
                'status': 'active'
            }
            students_list.append(student)

        total_linked_parents = 0
        for student in students_list:
            if student['parent_linked']:
                total_linked_parents += 1

        total_students_age = 0
        for student in students_list:
            if student['age'] is not None:
                total_students_age += student['age']

        context = {'total_students': len(students_list),
                   'total_linked_parents': total_linked_parents,
                   'total_not_linked_parents': len(students_list) - total_linked_parents,
                   'avg_age': int(round(total_students_age / len(students_list), 0)),
                   'students': students_list}
        return render(request, 'core/teacher_student_list.html', context)


@method_decorator(login_required, name='dispatch')
class ConversationStart(View):
    def get(self, request, student_id):
        student = get_object_or_404(
            Student,
            id=student_id
        )

        if request.user.is_parent:
            parent = request.user
            teacher = student.classroom.teacher

            if student.parent != request.user:
                return redirect('messages')

        elif request.user.is_teacher:
            parent = student.parent
            teacher = request.user

            if student.classroom.teacher != request.user:
                return redirect('messages')

        else:
            return redirect('messages')

        conversation, created = Conversation.objects.get_or_create(
            student=student,
            parent=parent,
            teacher=teacher
        )

        return redirect('conversation-detail', conversation.uid)


@method_decorator(login_required, name='dispatch')
class SendMessageView(View):

    def post(self, request, conversation_uid):

        conversation = get_object_or_404(
            Conversation,
            uid=conversation_uid
        )

        if request.user not in [conversation.parent, conversation.teacher]:
            return HttpResponse(status=403)

        form = MessageForm(request.POST, request.FILES)

        if form.is_valid():
            print(request.FILES)

            message = form.save(commit=False)

            message.conversation = conversation
            message.sender = request.user

            message.save()

            # IMPORTANT: update conversation timestamp
            conversation.save()

            # 👉 NEW: broadcast via WebSocket
            broadcast_message(request, conversation, message)

            return HttpResponse(status=204)  # no HTML needed

        return HttpResponse(status=400)


@method_decorator(login_required, name='dispatch')
class StaffListPage(View):
    def get(self, request):
        # views.py
        context = {
            'staff_list': [
                {
                    'id': 1,
                    'name': 'Mrs. Sarah Johnson',
                    'email': 'sarah.johnson@school.edu',
                    'role': 'teacher',           # 'teacher' or 'bursar'
                    'role_display': 'Teacher',   # 'Teacher' or 'Bursar'
                    'initials': 'SJ',
                    'date_added': datetime.strptime('2024-01-15', '%Y-%m-%d').date()
                },
                {
                    'id': 2,
                    'name': 'Mr. Michael Brown',
                    'email': 'michael.brown@school.edu',
                    'role': 'teacher',
                    'role_display': 'Teacher',
                    'initials': 'MB',
                    'date_added': datetime.strptime('2024-01-20', '%Y-%m-%d').date(),
                },
                {
                    'id': 3,
                    'name': 'Mr. John Adebayo',
                    'email': 'john.adebayo@school.edu',
                    'role': 'bursar',
                    'role_display': 'Bursar',
                    'initials': 'JA',
                    'date_added': datetime.strptime('2024-01-10', '%Y-%m-%d').date(),
                },
            ]
        }

        return render(request, 'core/staff_list.html', context)


@method_decorator(login_required, name='dispatch')
class AnnouncementPage(View):
    def get(self, request):
        context = {
            'announcements': [
                {
                    'id': 1,
                    'title': 'Fee Payment Deadline',
                    'message': 'First term fees are due by March 30th. Please make payments at the bursary office.',
                    'author': 'Mr. John Adebayo (Bursar)',
                    'created_at': datetime.strptime('2024-03-10 10:30:00', '%Y-%m-%d %H:%M:%S'),
                },
                {
                    'id': 2,
                    'title': 'School Resumption Date',
                    'message': 'School will resume for second term on April 15th. All students are expected back.',
                    'author': 'Dr. James Wilson (Principal)',
                    'created_at': datetime.strptime('2024-03-05 09:00:00', '%Y-%m-%d %H:%M:%S'),
                },
            ]
        }
        return render(request, 'core/announcements.html', context)


@method_decorator(login_required, name='dispatch')
class CreateAnnouncementView(View):

    def post(self, request):
        announcement_title = request.POST.get('announcement_title')
        announcement_body = request.POST.get('announcement_body')

        user = request.user

        if user.is_teacher and not (user.is_principal or user.is_burser):
            classroom = Classroom.objects.get(teacher=user)

            Announcement.objects.create(
                author=user,
                role="teacher",
                title=announcement_title,
                body=announcement_body,
                assigned_class=classroom
            )

        elif user.is_principal or user.is_burser:
            Announcement.objects.create(
                author=user,
                role="principal" if user.is_principal else 'bursar',
                title=announcement_title,
                body=announcement_body,
                assigned_class=None
            )

        else:
            return HttpResponse(status=403)

        messages.success(request, "Announcement published successfully.")
        return redirect(request.META.get("HTTP_REFERER", "/"))


