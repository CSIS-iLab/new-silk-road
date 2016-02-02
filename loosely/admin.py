from django.contrib import admin
from django import forms
from loosely.models import Entry, EntryType

from markymark.fields import MarkdownFormField


class EntryForm(forms.ModelForm):
    body = MarkdownFormField(required=False)


class EntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'entry_type')
    list_filter = ('entry_type',)
    prepopulated_fields = {"slug": ("title",)}
    form = EntryForm


class EntryTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Entry, EntryAdmin)
admin.site.register(EntryType, EntryTypeAdmin)
