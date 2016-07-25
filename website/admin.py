from django.contrib import admin
from django.db import models
from django.forms import Textarea
from django.contrib.flatpages.models import FlatPage
from django.contrib.flatpages.admin import FlatPageAdmin
from reversion.admin import VersionAdmin


admin.site.unregister(FlatPage)


@admin.register(FlatPage)
class FlatPageVersionAdmin(VersionAdmin, FlatPageAdmin):
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 30, 'class': 'htmlarea'})},
    }

    class Media:
        css = {
            "all": (
                "admin/js/codemirror/lib/codemirror.css",
                "admin/css/flatpages.css",
            )
        }
        js = (
            "admin/js/codemirror/lib/codemirror.js",
            "admin/js/codemirror/mode/xml/xml.js",
            "admin/js/codemirror/mode/htmlmixed/htmlmixed.js",
            "admin/js/flatpage.js",
        )
