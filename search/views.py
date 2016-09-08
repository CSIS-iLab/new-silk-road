from elasticsearch_dsl import FacetedSearch, TermsFacet
from django.views.generic.base import TemplateView
from collections import defaultdict

from .conf import SearchConf
from .utils import get_document_class

search_conf = SearchConf(auto_setup=True)
doc_type_classes = [get_document_class(x) for x in search_conf.get_doctypes_for_index(search_conf.default_index)]


class SiteSearch(FacetedSearch):
    index = search_conf.default_index
    doc_types = doc_type_classes
    fields = (
        '*name',
        '*.name^0.5',  # Negative boost to nested names (country.name, etc.)
        '*_type?',
        'title',
        'description',
        'content',
    )

    facets = {
        'kind': TermsFacet(field='_meta.model'),
        'countries': TermsFacet(field='countries.name'),
    }


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
