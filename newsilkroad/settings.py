"""
Django settings for newsilkroad project.

Generated by 'django-admin startproject' using Django 1.9.1.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os
import dj_database_url
import raven

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = os.getenv('SECRET_KEY', None)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'easy_thumbnails',
    'newsilkroad.apps.MediaConfig',
    'suit',
    'mptt',
    'leaflet',
    'markymark',
    'django_select2',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',

    'raven.contrib.django.raven_compat',

    'maintenancemode',

    'django_extensions',
    'storages',
    'rest_framework',
    'rest_framework_gis',

    'sources',
    'facts',
    'locations',
    'infrastructure',
    'website',
    'api',

    'fieldbook_importer',
]

if DEBUG and os.getenv("DEBUG_TOOLBAR", "False") == "True":
    INSTALLED_APPS.append('debug_toolbar')

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'raven.contrib.django.raven_compat.middleware.SentryResponseErrorIdMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'maintenancemode.middleware.MaintenanceModeMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'newsilkroad.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'debug': True if os.getenv('TEMPLATE_DEBUG', 'True') == 'True' else DEBUG,
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'newsilkroad.wsgi.application'

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    'root': {
        'level': 'WARNING',
        'handlers': ['sentry'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s '
                      '%(process)d %(thread)d %(message)s'
        },
    },
    "handlers": {
        'sentry': {
            'level': 'ERROR',  # To capture more than ERROR, change to WARNING, INFO, etc.
            'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
            'tags': {'custom-tag': 'x'},
        },
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        'django': {
            "handlers": ["console"],
        },
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['console'],
            'propagate': False,
        },
        'raven': {
            'level': 'DEBUG',
            'handlers': ['console'],
            'propagate': False,
        },
        'sentry.errors': {
            'level': 'DEBUG',
            'handlers': ['console'],
            'propagate': False,
        },
    }
}

# Sentry config
RAVEN_CONFIG = {
    'dsn': os.getenv('SENTRY_DSN'),
    # If you are using git, you can also automatically configure the
    # release based on the git info.
    'release': raven.fetch_git_sha(BASE_DIR),
}

# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {'default': dj_database_url.config()}
DATABASES['default']['ENGINE'] = 'django.contrib.gis.db.backends.postgis'
DATABASES['default']['CONN_MAX_AGE'] = 500

# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'en-us'


TIME_ZONE = 'America/New_York'

USE_I18N = False

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME', None)
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME

STATICFILES_LOCATION = 'static'
STATICFILES_STORAGE = 'newsilkroad.project_storages.StaticStorage'
STATIC_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, STATICFILES_LOCATION)
STATIC_ROOT = os.path.join(BASE_DIR, 'serve/staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'website/static_overrides')
]

# Media aka uploads
MEDIAFILES_LOCATION = 'media'
MEDIA_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, MEDIAFILES_LOCATION)
DEFAULT_FILE_STORAGE = 'newsilkroad.project_storages.MediaStorage'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# django-suit
SUIT_CONFIG = {
    'ADMIN_NAME': 'Reconnecting Asia',
    # 'CONFIRM_UNSAVED_CHANGES': True
    'MENU': (
        '-',
        'infrastructure',
        '-',
        {'label': 'Organizations', 'models': ('facts.organization',)},
        {'label': 'Companies', 'models': (
            'facts.companydetails',
            'facts.companystructure',
            'facts.companytype',
        )},
        {'label': 'Financing', 'models': ('facts.financingorganizationdetails', 'facts.financingtype')},
        {'label': 'Government', 'models': ('facts.governmentdetails',)},
        {'label': 'Multilaterals', 'models': ('facts.multilateraldetails', 'facts.multilateraltype')},
        {'label': 'Military', 'models': ('facts.militarydetails', 'facts.militarytype')},
        {'label': 'NGO', 'models': ('facts.ngodetails', 'facts.ngotype')},
        {'label': 'Political', 'models': ('facts.politicaldetails', 'facts.politicaltype')},
        {'label': 'Events', 'models': ('facts.event', 'facts.eventtype')},
        {'label': 'People', 'models': ('facts.person', 'facts.position')},
        '-',
        {'label': 'Locations', 'models': (
            'locations.country',
            'locations.region',
            'locations.place'
        )},
        {'label': 'Geodata', 'models': (
            'locations.geometrystore',
            'locations.linestringgeometry',
            'locations.pointgeometry',
            'locations.polygongeometry',
        )},
        {'label': 'Upload Geodata', 'url': 'infrastructure-admin:project-geo-upload', },
        '-',
        'media',
        'sources',
        '-',
        'auth',
    )
}

# markymark
MARKYMARK_EXTENSIONS = [
    'markymark.extensions.contrib.filer',
]

LEAFLET_CONFIG = {
    'DEFAULT_CENTER': (31.5975071, 97.173225),
    'DEFAULT_ZOOM': 4,
}
MAPBOX_TOKEN = os.getenv('MAPBOX_TOKEN')
MAPBOX_STYLE_URL = os.getenv('MAPBOX_STYLE_URL', 'mapbox://styles/mapbox/streets-v8')

if DEBUG and os.getenv('DEBUG_STATIC', 'False') == 'True':
    STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
    STATIC_URL = '/%s/' % STATICFILES_LOCATION
    MEDIA_URL = '/%s/' % MEDIAFILES_LOCATION


# Setting this variable to ``True`` activates the maintenancemode middleware.
MAINTENANCE_MODE = os.getenv('MAINTENANCE_MODE', 'False') == 'True'
MAINTENANCE_IGNORE_URLS = (
    r'^/admin/.*',
)
