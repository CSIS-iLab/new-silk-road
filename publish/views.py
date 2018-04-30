

class PublicationMixin(object):

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated and hasattr(queryset, 'published'):
            queryset = queryset.published()
        return queryset
