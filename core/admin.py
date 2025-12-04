from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.CustomUser)
admin.site.register(models.ParentProfile)
admin.site.register(models.TeacherProfile)
admin.site.register(models.Classroom)
admin.site.register(models.Student)
admin.site.register(models.Message)