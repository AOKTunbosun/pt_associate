from django.core.mail.backends.base import BaseEmailBackend
import resend
from django.conf import settings

class ResendBackend(BaseEmailBackend):
    def send_messages(self, email_messages):
        resend.api_key = settings.RESEND_API_KEY

        for message in email_messages:
            resend.Emails.send({
                "from": message.from_email,
                "to": message.to,
                "subject": message.subject,
                "html": message.body,
            })
