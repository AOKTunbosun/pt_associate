from django.urls import path
from . import consumers


websocket_urlpatterns = [
    # path('ws/notifications/', NotificationConsumer.as_asgi()),
    path('ws/messages/<uuid:conversation_uid>/', consumers.ChatConsumer.as_asgi())
]