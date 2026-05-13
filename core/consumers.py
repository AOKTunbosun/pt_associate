from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.template.loader import render_to_string

from .models import Message


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.conversation_uid = self.scope['url_route']['kwargs']['conversation_uid']
        self.room_group_name = f"chat_{self.conversation_uid}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        print(f"Connected to {self.room_group_name}")

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def chat_message(self, event):
        message_id = event["message_id"]

        message = Message.objects.select_related("sender").get(id=message_id)

        current_user = self.scope["user"]

        html = render_to_string(
            "core/partials/chat_partials/ws_message.html",
            {
                "message": message,
                "current_user": current_user,
            }
        )

        self.send(text_data=html)