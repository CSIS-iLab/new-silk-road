from markymark.fields import MarkdownTextarea


class BigMarkdownTextarea(MarkdownTextarea):

    def __init__(self, attrs=None):
        default_attrs = {'cols': '40', 'rows': '30'}
        if attrs:
            default_attrs.update(attrs)
        super(BigMarkdownTextarea, self).__init__(default_attrs)
