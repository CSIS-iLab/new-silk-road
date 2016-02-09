from django.db import models
from django.utils.text import slugify
from mptt.models import MPTTModel, TreeForeignKey
from markymark.fields import MarkdownField
from markymark.utils import render_markdown
from taggit.managers import TaggableManager


class Article(models.Model):
    """An article in the knowledgebase"""
    title = models.CharField(max_length=100)
    slug = models.SlugField()
    body = MarkdownField()
    body_rendered = models.TextField(blank=True, editable=False)

    tags = TaggableManager(blank=True)

    def __str__(self):
        return self.slug

    def _render_body_markdown(self):
        self.body_rendered = render_markdown(self.body)

    def _set_slug(self, text=None):
        self.slug = slugify(text or self.title)

    def save(self, *args, **kwargs):
        if self.body:
            self._render_body_markdown()
        if not self.slug or self.slug == '':
            self._set_slug()
        super(Article, self).save(*args, **kwargs)


class Category(MPTTModel):
    """An Article's Category"""
    name = models.CharField(max_length=100, unique=True)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True)

    class Meta:
        verbose_name_plural = "Categories"

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name
