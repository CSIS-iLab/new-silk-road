from django.contrib import admin
from django.utils.html import format_html
from .models import CollectionItem, Collection
from django.core.urlresolvers import reverse, NoReverseMatch


class CollectionItemAdmin(admin.ModelAdmin):
    readonly_fields = ('item_representation',)
    list_display = (
        '__str__',
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


class CollectionAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = [
        'items',
    ]

admin.site.register(Collection, CollectionAdmin)
admin.site.register(CollectionItem, CollectionItemAdmin)
