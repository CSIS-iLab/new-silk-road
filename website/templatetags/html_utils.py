from django import template
import bleach

register = template.Library()

TEXT_TAGS = ['p', 'a', 'b', 'i', 'em', 'strong']


@register.filter(name='html_text')
def html_text(value):
    return bleach.clean(value, strip=True, tags=TEXT_TAGS)
