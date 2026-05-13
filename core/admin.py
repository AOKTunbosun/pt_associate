from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.CustomUser)
admin.site.register(models.Classroom)
admin.site.register(models.Student)
admin.site.register(models.ChatGroup)
admin.site.register(models.GroupMessage)
admin.site.register(models.Announcement)
admin.site.register(models.Institution)
admin.site.register(models.Conversation)
admin.site.register(models.Message)
