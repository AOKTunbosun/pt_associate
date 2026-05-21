from django.db import models
from django.contrib.auth.models import AbstractUser

import uuid

# Create your models here.


class CustomUser(AbstractUser):
    # Extending the User model

    email = models.EmailField(unique=True)

    phone_number = models.BigIntegerField(default=None, null=True)
    gender = models.CharField(null=True, max_length=8, choices=[
                              ('male', 'male'), ('female', 'female')])
    is_parent = models.BooleanField(default=False, null=True)
    is_teacher = models.BooleanField(default=False, null=True)
    is_principal = models.BooleanField(default=False, null=True)
    is_burser = models.BooleanField(default=False, null=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Institution(models.Model):
    id = models.AutoField(primary_key=True)
    institution_name = models.CharField(
        max_length=500, null=False, unique=True, db_index=True)
    principal = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, related_name='principal')
    burser = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, related_name='burser')
    institution_type = models.CharField(max_length=10)
    location = models.CharField(max_length=350, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.institution_name


class Classroom(models.Model):
    id = models.AutoField(primary_key=True)
    classroom_name = models.CharField(max_length=150, null=False)
    teacher = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, related_name='teaches_in')
    institution = models.ForeignKey(
        Institution, on_delete=models.CASCADE, null=True, related_name='classrooms')
    academic_session = models.CharField(max_length=10, default=None, null=True)
    classroom_code = models.CharField(max_length=20, default=None, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.classroom_name} in {self.institution.institution_name}"


class Student(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField(null=True)
    gender = models.CharField(null=True, max_length=8, choices=[
                              ('male', 'male'), ('female', 'female')])
    classroom = models.ForeignKey(
        Classroom, on_delete=models.CASCADE, null=False, related_name='students')
    parent = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} in {self.classroom.classroom_name} in {self.classroom.institution.institution_name}"


class Announcement(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=150)
    body = models.TextField()
    classroom_id = models.ForeignKey(
        Classroom, on_delete=models.CASCADE, related_name='announcements')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.classroom_id.classroom_name} Announcement'


class Staff(models.Model):
    id = models.AutoField(primary_key=True)
    staff = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='staff', null=False)
    institution = models.ForeignKey(
        Institution, on_delete=models.CASCADE, related_name='institution_staff')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['staff', 'institution'],
                name='unique_staff_per_institution'
            )
        ]

    def __str__(self):
        return f'{self.staff.first_name} {self.staff.last_name} is a staff of {self.institution.institution_name}'


class ChatGroup(models.Model):
    id = models.AutoField(primary_key=True)
    group_name = models.CharField(max_length=150, null=False)
    classroom = models.ForeignKey(
        Classroom, on_delete=models.CASCADE, related_name='chat_groups')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.group_name} in {self.classroom.classroom_name}'


class GroupMessage(models.Model):
    id = models.AutoField(primary_key=True)
    group = models.ForeignKey(
        ChatGroup, on_delete=models.CASCADE, related_name='chat_messages')
    author = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.author.first_name} in {self.group.group_name}'

    class Meta:
        ordering = ['-created']


class Conversation(models.Model):
    id = models.AutoField(primary_key=True)
    uid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    parent = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='parent_conversations',
        null=True,
        blank=True
    )

    teacher = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='teacher_conversations',
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Conversation {self.id}"


class Message(models.Model):
    id = models.AutoField(primary_key=True)

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    sender = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True)

    body = models.TextField(blank=True, null=True)

    file = models.FileField(
        upload_to="chat_files/",
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["created_at"]
