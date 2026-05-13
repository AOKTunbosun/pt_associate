from ..models import Message, Conversation

def create_message(*, conversation, sender, body):
    return Message.objects.create(
        conversation=conversation,
        sender=sender,
        body=body
    )