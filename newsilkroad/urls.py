"""newsilkroad URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from infrastructure.urls import adminpatterns

admin.site.site_header = "New Silk Road Administration"
admin.site.site_title = "NSR Admin"

DEBUG = getattr(settings, 'DEBUG', False)

urlpatterns = [
    url(r'^', include('website.urls')),
    url(r'^filer/', include('filer.urls')),
    url(r'^api/', include('api.urls')),
    url(r'^infrastructure/', include('infrastructure.urls')),
    url(r'^search/', include('search.urls')),
    url(r'^admin/django-rq/', include('django_rq.urls')),
    url(r'^admin/infrastructure/', include(adminpatterns, namespace='infrastructure-admin')),
    url(r'^admin/', admin.site.urls),
    url(r'^taggit_autosuggest/', include('taggit_autosuggest.urls')),
    url(r'^admin-select2/', include('django_select2.urls')),
]

if DEBUG:
    urlpatterns = urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
