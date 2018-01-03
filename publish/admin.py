TEMPORAL_FIELDS = ('created_at', 'updated_at')


def make_published(modeladmin, request, queryset):
    queryset.update(published=True)


make_published.short_description = "Mark items as published"


def make_not_published(modeladmin, request, queryset):
    queryset.update(published=False)


make_not_published.short_description = "Mark items as not published"
