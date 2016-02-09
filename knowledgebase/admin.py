from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from knowledgebase.models import Article, Category
from markymark.fields import MarkdownField
from knowledgebase.widgets import BigMarkdownTextarea


class ArticleAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    formfield_overrides = {
        MarkdownField: {'widget': BigMarkdownTextarea}
    }


class CategoryAdmin(MPTTModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ['name', 'slug']


admin.site.register(Article, ArticleAdmin)
admin.site.register(Category, CategoryAdmin)
