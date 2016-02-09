from django.db import models
from markymark.fields import MarkdownField
from markymark.utils import render_markdown
from django.utils.text import slugify

from taggit.managers import TaggableManager


class Article(models.Model):
    """An article in the knowledgebase"""
    title = models.CharField(max_length=100)
    slug = models.SlugField()
    body = MarkdownField()
    body_rendered = models.TextField(blank=True)

    tags = TaggableManager()

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
