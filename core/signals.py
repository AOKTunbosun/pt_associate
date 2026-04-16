from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Institution


@receiver(post_save, sender=Institution)
def make_user_principal(sender, instance, created, **kwargs):

    if created:
        user = instance.principal
        user.is_principal = True
        user.save()