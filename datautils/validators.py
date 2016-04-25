from django.core.exceptions import ValidationError
from django.core.validators import _lazy_re_compile
from django.utils.encoding import force_text
from urllib.parse import urlsplit


class URLLikeValidator:
    """Validates that value is 'url-like'. Does not perform strict URL validation, but looks for appropriate schemes"""

    # Taken from django.core.validators.URLValidator
    ipv4_re = r'(?:25[0-5]|2[0-4]\d|[0-1]?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}'
    ipv6_re = r'\[[0-9a-f:\.]+\]'  # (simple regex, validated later)
    # Loose domain regex, adapted from URLValidator
    name_part = r'[a-z0-9' + '\u00a1-\uffff' + r'-_]'
    domain_re = r'((?:' + name_part + r'+\.)' + r'(?:' + name_part + r'+\.?)+)'
    netloc_re = r'(' + ipv4_re + r'|' + ipv6_re + r'|' + domain_re + r')'

    def __init__(self, schemes=None, **kwargs):
        self.schemes = schemes or ('http', 'https', 'ftp', 'sftp')
        self.scheme_list = '|'.join(self.schemes)
        self.regex = _lazy_re_compile(self.netloc_re)

    def __call__(self, value):
        urlparts = urlsplit(force_text(value))
        if urlparts.scheme not in self.schemes:
            raise ValidationError('Enter a URL with a valid scheme. ({})'.format(self.scheme_list))
        if not bool(self.regex.fullmatch(urlparts.netloc)):
            raise ValidationError('Enter a URL with valid a network location (domain or ip address).')
