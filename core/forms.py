import os

from django import forms
from .models import Message

class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ["body", "file"]

        widgets = {
            "body": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Type your message...",
                "autocomplete": "off"
            }),

            "file": forms.ClearableFileInput(attrs={
                "id": "fileInput",
                "hidden": True,
                "accept": ".jpg,.jpeg,.png,.webp,.pdf,.gif"
            })
        }
    
    def clean_file(self):
        file = self.cleaned_data.get("file")

        if not file:
            return file

        max_size = 15 * 1024 * 1024  # 15MB
        if file.size > max_size:
            raise forms.ValidationError("File must not exceed 15MB.")

        ext = os.path.splitext(file.name)[1].lower()

        allowed = [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".gif"]

        if ext not in allowed:
            raise forms.ValidationError("Only images and PDFs are allowed.")

        return file

    def clean(self):
        cleaned_data = super().clean()

        body = cleaned_data.get("body")
        file = cleaned_data.get("file")

        # must have at least one
        if not body and not file:
            raise forms.ValidationError("Send a message or attach a file.")

        return cleaned_data