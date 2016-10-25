from django.conf import settings

GOOGLE_ANALYTICS_KEY = getattr(settings, 'GOOGLE_ANALYTICS_KEY', '')


def analytics(request):
    if settings.DEBUG:
        return {
            'GOOGLE_ANALYTICS_KEY': None
        }
    else:
        return {
            'GOOGLE_ANALYTICS_KEY': GOOGLE_ANALYTICS_KEY
        }
