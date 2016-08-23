from django.contrib import admin
from django.db import models
from django.forms import Textarea
from django.contrib.flatpages.models import FlatPage
from django.contrib.flatpages.admin import FlatPageAdmin
from django.contrib.contenttypes.admin import GenericStackedInline
from suit.admin import SortableStackedInline
from reversion.admin import VersionAdmin
from django.utils.html import format_html
from .models import CollectionItem, Collection
from django.core.urlresolvers import reverse, NoReverseMatch


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


class CollectionItemAdmin(admin.ModelAdmin):
    readonly_fields = ('item_representation',)
    list_display = (
        '__str__',
        'collection_id',
        'order',
        'item_admin_url',
    )

    def item_representation(self, instance):
        return str(instance)
    item_representation.short_description = 'Item'

    def item_admin_url(self, instance):
        calc_url = 'admin:{}_{}_change'.format(instance.content_type.app_label, instance.content_type.model)
        try:
            reverse_url = reverse(calc_url, args=(instance.id,))
            return format_html("<a href='{}' target='_blank'>View in admin</a>", reverse_url)
        except NoReverseMatch:
            return '—'
    item_admin_url.short_description = 'Admin URL'


class CollectionItemInline(SortableStackedInline):
    model = CollectionItem
    sortable = 'order'


class CollectionAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    inlines = [
        CollectionItemInline,
    ]

admin.site.register(Collection, CollectionAdmin)
admin.site.register(CollectionItem, CollectionItemAdmin)
