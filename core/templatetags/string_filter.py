from django import template

register = template.Library()


@register.filter(name='startswith')
def startswith(value, arg):
    return str(value).startswith(str(arg))
