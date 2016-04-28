from django.contrib import admin

from .models import Document


class DocumentAdmin(admin.ModelAdmin):
    list_display = ('source_file', 'url', 'id')
    search_fields = ('source_file', 'url')

    class Media:
        css = {
            "all": ("filer/css/adminfixes.css",)
        }

admin.site.register(Document, DocumentAdmin)
