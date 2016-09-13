from django.views.generic.base import TemplateView
from collections import defaultdict
from .searches import SiteSearch


class SearchView(TemplateView):

    template_name = "search/results.html"
    http_method_names = ['get', 'head']

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.search_response = None
        self.search_query = dict()
        self.offset = 0
        self.size = 10
        self.page_params = []

    def get(self, request, *args, **kwargs):
        self.process_search_request(request)
        return super().get(request, *args, **kwargs)

    def process_search_request(self, request):
        self.search_query['q'] = request.GET.get('q')
        self.search_query['facet'] = request.GET.getlist('facet')

        if self.search_query.get('q', None):
            facets = defaultdict(list)
            facets_raw = self.search_query['facet']
            facets_split = (f.split(':') for f in facets_raw)
            valid_facets = (f for f in facets_split if len(f) == 2)
            for name, value in valid_facets:
                facets[name].append(value)

            offset_raw = request.GET.get('offset', '')
            if offset_raw.isdecimal():
                self.offset = int(offset_raw)
            size_raw = request.GET.get('size', '')
            if size_raw.isdecimal():
                self.size = int(size_raw)

            search = SiteSearch(self.search_query['q'], facets)
            search = search.paginate(self.offset, size=self.size)
            self.search_response = search.execute()

    def get_context_data(self, **kwargs):
        context = super(SearchView, self).get_context_data(**kwargs)

        context['search'] = {
            'query': self.search_query['q'],
            'offset': self.offset,
            'size': self.size,
            'total': self.search_response.hits.total,
            'response': self.search_response,
            'facets': self.search_response.facets.to_dict() if hasattr(self.search_response, 'facets') else None
        }
        return context
