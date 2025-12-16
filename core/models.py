from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    # Extending the User model

    phone_number = models.IntegerField(default=None, null=True)
    is_parent = models.BooleanField(default=False, null=True)
    is_teacher = models.BooleanField(default=False, null=True)


    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class ParentProfile(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_id.first_name} {self.user_id.last_name}'s parent profile"


class TeacherProfile(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_id.first_name} {self.user_id.last_name}'s teacher profile"


class SchoolProfile(models.Model):
    id = models.AutoField(primary_key=True)
    school_name = models.CharField(max_length=500, null=False, unique=True, db_index=True)
    school_admin = models.ForeignKey(TeacherProfile, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.school_name


class Classroom(models.Model):
    id = models.AutoField(primary_key=True)
    classroom_name = models.CharField(max_length=150, null=False)
    teacher_id = models.ForeignKey(TeacherProfile, on_delete=models.SET_NULL, null=True)
    school_id = models.ForeignKey(SchoolProfile, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.classroom_name} in {self.school_id.school_name}"


class Student(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    classroom_id = models.ForeignKey(Classroom, on_delete=models.CASCADE, null=False)
    parent_id = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} in {self.classroom_id.classroom_name}"
    

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    sender_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=False, related_name='sender')
    receiver_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=False, related_name='receiver')
    message_body = models.TextField(default=None, null=True)
    is_viewed = models.BooleanField(default=False, null=True)
    edited = models.BooleanField(default=False, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender_id.first_name} {self.sender_id.last_name} message to {self.receiver_id.first_name} {self.receiver_id.lastname}"


class Announcement(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=150)
    body = models.TextField()
    classroom_id = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='announcements')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.classroom_id.classroom_name} Announcement'