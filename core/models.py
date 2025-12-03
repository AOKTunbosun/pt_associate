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

    def __str__(self):
        return f"{self.user_id.first_name} {self.user_id.last_name}'s parent profile"


class TeacherProfile(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user_id.first_name} {self.user_id.last_name}'s teacher profile"

