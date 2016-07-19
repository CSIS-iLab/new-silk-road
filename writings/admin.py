from django.contrib import admin
from .models import (
    Category,
    Entry
)


class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


class EntryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}

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


admin.site.register(Category, CategoryAdmin)
admin.site.register(Entry, EntryAdmin)
