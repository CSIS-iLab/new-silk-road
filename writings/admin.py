from django.contrib import admin
from django.utils.html import format_html, format_html_join
from .models import (
    Category,
    Entry
)
from django.utils import timezone


def make_published_with_date(modeladmin, request, queryset):
    queryset.update(published=True, publication_date=timezone.now())
make_published_with_date.short_description = "Mark items as published"


def make_not_published_reset_date(modeladmin, request, queryset):
    queryset.update(published=False, publication_date=None)
make_not_published_reset_date.short_description = "Mark items as not published"


class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ('name', 'entry_count')

    def entry_count(self, obj):
        return obj.entries.count()
    entry_count.short_description = 'No. of entries'


class EntryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ('title', 'categories_display', 'published', 'publication_date', 'page_is_visble', 'page_link', 'updated_at')
    list_filter = ('published', 'categories')
    filter_horizontal = ('categories',)
    fieldsets = (
        (None, {
            'fields': ('published', 'publication_date')
        }),
        (None, {
            'fields': ('title', 'slug', 'author', 'content')
        }),
        (None, {
            'description': 'Elements that can be used to tease/share post',
            'fields': ('share_text', 'featured_image', 'description')
        }),
        (None, {
            'fields': ('categories', 'tags',)
        })
    )
    actions = [
        make_published_with_date,
        make_not_published_reset_date,
    ]

    class Media:
        css = {
            "all": ("admin/css/adminfixes.css",)
        }

    def categories_display(self, obj):
        cat_list = format_html_join(
            '\n', "<li>{}</li>",
            ((c.name,) for c in obj.categories.all().only('name'))
        )
        return format_html("<ul>{}</ul>".format(cat_list))
    categories_display.description = "Categories"

    def page_link(self, obj):
        return format_html(
            '<a href="{}" target="_blank">View on Site</a>',
            obj.get_absolute_url()
        )
    page_link.description = "View on Site"

    def page_is_visble(self, obj):
        return obj.published and obj.publication_date <= timezone.now()
    page_is_visble.description = "Visible on Site?"
    page_is_visble.boolean = True


admin.site.register(Category, CategoryAdmin)
admin.site.register(Entry, EntryAdmin)
