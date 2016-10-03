from django.db import models
from django.db.models.query import Q
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
    author = models.CharField('Author(s)', blank=True, max_length=100)

    content = MarkdownField(blank=True)
    content_rendered = models.TextField(blank=True, editable=False)
    description = MarkdownField(
        'Summary/Description',
        blank=True,
        help_text='Short text to be used where post might be promoted/referenced. Limited to 400 characters.'
    )
    description_rendered = models.TextField(blank=True, editable=False)
    share_text = models.CharField(blank=True, max_length=140)
    featured_image = FilerImageField(blank=True, null=True)

    publication_date = models.DateTimeField(
        blank=True,
        null=True,
        help_text="""<p>Publication date will be set to the current time automatically, when <em>published</em> is selected.
        <p>You may set a date/time manually, but <strong>you must
            select <em>published</em> for the post to appear!</strong>
        """
    )

    categories = models.ManyToManyField(
        Category,
        blank=True,
        related_name='entries',
    )
    tags = TaggableManager(blank=True)
    related_entries = models.ManyToManyField('self', blank=True)

    class Meta:
        ordering = ("-publication_date", "-created_at")
        get_latest_by = "publication_date"
        verbose_name = "entry"
        verbose_name_plural = "entries"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.published and not self.publication_date:
            self.publication_date = timezone.now()
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

    def get_next_published_entry(self):
        if not self.publication_date:
            return None  # If no publication date
        query = Q(publication_date__gt=self.publication_date)
        query |= Q(publication_date=self.publication_date, pk__gt=self.pk)
        qs = self.__class__.objects.published().filter(query).order_by('publication_date', 'pk')
        try:
            return qs[0]
        except IndexError:
            return None

    def get_previous_published_entry(self):
        if not self.publication_date:
            return None  # If no publication date
        query = Q(publication_date__lt=self.publication_date)
        query |= Q(publication_date=self.publication_date, pk__lt=self.pk)
        qs = self.__class__.objects.published().filter(query).order_by('-publication_date', '-pk')
        try:
            return qs[0]
        except IndexError:
            return None


class EntryCollection(Temporal):
    """An ordered collection of Entries"""
    name = models.CharField(max_length=40)
    slug = models.SlugField(allow_unicode=True, unique=True)
    entries = models.ManyToManyField(
        Entry,
        through='OrderedEntry',
        related_name='ordered_collections'
    )

    class Meta:
        get_latest_by = "publication_date"
        verbose_name = "entry collection"
        verbose_name_plural = "collections"

    def __str__(self):
        return self.name


class OrderedEntry(models.Model):
    entry = models.ForeignKey(Entry, models.CASCADE)
    collection = models.ForeignKey(EntryCollection, models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ("collection", "order")
        verbose_name = "ordered entry"
        verbose_name_plural = "ordered entries"
