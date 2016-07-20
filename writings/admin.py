from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Category,
    Entry
)


class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ('name', 'entry_count')

    def entry_count(self, obj):
        return obj.entries.count()
    entry_count.short_description = 'No. of entries'


class EntryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ('title', 'category', 'published', 'published_at', 'page_link')
    fieldsets = (
        (None, {
            'fields': ('published',)
        }),
        (None, {
            'fields': ('title', 'slug', 'content')
        }),
        (None, {
            'description': 'Elements that can be used to tease/share post',
            'fields': ('share_text', 'featured_image', 'description')
        }),
        (None, {
            'fields': ('category', 'tags',)
        })
    )

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }

    def page_link(self, obj):
        return format_html(
            '<a href="{}" target="_blank">View on Site</a>',
            obj.get_absolute_url()
        )
    page_link.description = "View on Site"


admin.site.register(Category, CategoryAdmin)
admin.site.register(Entry, EntryAdmin)
