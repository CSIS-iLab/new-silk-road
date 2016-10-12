from django import template
import bleach

register = template.Library()

TEXT_TAGS = "p,a,b,i,em,strong"


@register.filter(name='html_text')
def html_text(value, tags=TEXT_TAGS):
    '''Cleans up HTML, stripping away all but a list of HTML tags to preserve.
    By default, this list is "p,a,b,i,em,strong", but you may
    provide a comma-separated list of tags to preserve.
    '''
    return bleach.clean(value, strip=True, tags=[t.strip() for t in str(tags).split(',')])
