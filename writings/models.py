from django.db import models
from django.utils import timezone
from django.core.urlresolvers import reverse
from publish.models import Publishable, Temporal
from markymark.fields import MarkdownField
from markymark.utils import render_markdown
from taggit.managers import TaggableManager
from filer.fields.image import FilerImageField


class Category(Temporal):
    """A category of entries"""
    name = models.CharField(max_length=40)
    slug = models.SlugField(allow_unicode=True, unique=True)

    class Meta:
        verbose_name = "category"
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse(
            'writings:category-detail',
            kwargs={
                'slug': self.slug,
            }
        )


class Entry(Publishable):
    """An entry in a 'blog' or whatever you want to call it."""
    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=110, allow_unicode=True, unique=True)

    content = MarkdownField(blank=True)
    content_rendered = models.TextField(blank=True, editable=False)
    description = MarkdownField(
        blank=True,
        help_text='Short text to be used where post might be promoted/referenced'
    )
    description_rendered = models.TextField(blank=True, editable=False)
    share_text = models.CharField(blank=True, max_length=140)

    featured_image = FilerImageField(blank=True, null=True)

    published_at = models.DateTimeField(blank=True, null=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='entries',
    )
    tags = TaggableManager(blank=True)

    class Meta:
        ordering = ("-published_at", "-created_at")
        get_latest_by = "published_at"
        verbose_name = "entry"
        verbose_name_plural = "entries"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.published and not self.published_at:
            self.published_at = timezone.now()
        self.content_rendered = render_markdown(self.content)
        self.description_rendered = render_markdown(self.description)
        super(Entry, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse(
            'writings:entry-detail',
            kwargs={
                'slug': self.slug,
            }
        )
