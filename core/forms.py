from django import forms
from .models import Message

class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ["body"]

        widgets = {
            "body": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Type your message...",
                "autocomplete": "off"
            })
        }