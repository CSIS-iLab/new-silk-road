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

            search = SiteSearch(self.search_query['q'], facets)
            self.search_response = search.execute()

    def get_context_data(self, **kwargs):
        context = super(SearchView, self).get_context_data(**kwargs)
        context['search_query'] = self.search_query
        if hasattr(self.search_response, 'facets'):
            context['search_facets'] = self.search_response.facets.to_dict()
        context['search_response'] = self.search_response
        return context
