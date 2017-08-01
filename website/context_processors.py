from django.conf import settings


def analytics(request):
    if settings.DEBUG:
        return {
            'GOOGLE_ANALYTICS_KEY': None
        }
    else:
        return {
            'GOOGLE_ANALYTICS_KEY': getattr(settings, 'GOOGLE_ANALYTICS_KEY', '')
        }
