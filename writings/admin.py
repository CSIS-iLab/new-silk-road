from django.contrib import admin
from django import forms
from django.utils.html import format_html, format_html_join
from markymark.widgets import MarkdownTextarea
from taggit_helpers.admin import TaggitListFilter, TaggitCounter
from .models import (
    Category,
    Entry,
    EntryCollection,
    OrderedEntry,
)
from django.utils import timezone


def make_published_with_date(modeladmin, request, queryset):
    queryset.update(published=True, publication_date=timezone.now())
make_published_with_date.short_description = "Mark items as published"


def make_not_published_reset_date(modeladmin, request, queryset):
    queryset.update(published=False, publication_date=None)
make_not_published_reset_date.short_description = "Mark items as not published"


class EntryInline(admin.StackedInline):
    model = Entry.categories.through


class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ('name', 'entry_count')
    inlines = [
        EntryInline,
    ]

    def entry_count(self, obj):
        return obj.entries.count()
    entry_count.short_description = 'No. of entries'


class EntryForm(forms.ModelForm):

    class Meta:
        model = Entry
        fields = '__all__'
        widgets = {
            'content': MarkdownTextarea(attrs={'rows': 40}),
            'description': MarkdownTextarea(attrs={'rows': 6, 'maxlength': 425}),
        }


class EntryAdmin(TaggitCounter, admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ('title', 'categories_display', 'taggit_counter', 'published', 'publication_date', 'page_is_visible', 'page_link', 'updated_at')
    list_filter = ('published', 'categories', TaggitListFilter)
    ordering = ['publication_date', 'title', 'published', 'created_at']
    filter_horizontal = ('categories', 'related_entries',)
    fieldsets = (
        (None, {
            'fields': ('published', 'publication_date')
        }),
        (None, {
            'fields': ('title', 'slug', 'subtitle', 'author', 'content'),
            'classes': ('input-wide',)
        }),
        (None, {
            'description': 'Elements that can be used to tease/share post',
            'fields': ('share_text', 'featured_image', 'description'),
            'classes': ('input-wide',)
        }),
        (None, {
            'fields': ('categories', 'tags', 'related_entries',)
        }),
        (None, {
            'fields': ('is_sponsored', 'sponsored_logo',)
        })
    )
    form = EntryForm
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

    def page_is_visible(self, obj):
        return obj.is_visible()
    page_is_visible.description = "Visible on Site?"
    page_is_visible.boolean = True


class OrderedEntryInline(admin.StackedInline):
    model = OrderedEntry
    sortable = 'order'
    ordering = ['order', ]
    readonly_fields = ('entry_visible', 'entry_published', 'entry_publication_date')
    show_change_link = True
    fieldsets = (
        (None, {
            'fields': (('entry', 'order'),)
        }),
        (None, {
            'fields': ('entry_publication_date', 'entry_published', 'entry_visible',)
        }),
    )

    def entry_publication_date(self, instance):
        if instance.entry.publication_date:
            return instance.entry.publication_date.strftime('%Y-%m-%d %H:%M:%S')
        return None
    entry_publication_date.description = 'Publication Date'

    def entry_published(self, instance):
        return instance.entry.published
    entry_published.description = 'Published'
    entry_published.boolean = True

    def entry_visible(self, instance):
        return instance.entry.is_visible()
    entry_visible.description = 'Visible'
    entry_visible.boolean = True


class EntryCollectionAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ('name', 'slug', 'entry_count')

    inlines = [
        OrderedEntryInline,
    ]

    def entry_count(self, obj):
        return obj.entries.count()
    entry_count.short_description = 'No. of entries'


admin.site.register(Category, CategoryAdmin)
admin.site.register(Entry, EntryAdmin)
admin.site.register(EntryCollection, EntryCollectionAdmin)
