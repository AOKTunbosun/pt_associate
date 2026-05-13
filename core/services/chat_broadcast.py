
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def broadcast_message(request, conversation, message):
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"chat_{conversation.uid}",
        {
            "type": "chat.message",
            "message_id": message.id
        }
    )