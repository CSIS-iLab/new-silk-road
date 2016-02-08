from django.db import models
from markymark.fields import MarkdownField
from markymark.utils import render_markdown


class Article(models.Model):
    """An article in the knowledgebase"""
    title = models.CharField(max_length=100)
    slug = models.SlugField()
    body = MarkdownField()
    body_rendered = models.TextField(blank=True)

    def __str__(self):
        return self.slug

    def _render_body_markdown(self):
        self.body_rendered = render_markdown(self.body)

    def save(self, *args, **kwargs):
        if self.body:
            self._render_body_markdown()
        super(Article, self).save(*args, **kwargs)
