from elasticsearch_dsl import FacetedSearch, TermsFacet
from django.views.generic.base import TemplateView

from .conf import SearchConf
from .utils import get_document_class

search_conf = SearchConf(auto_setup=True)
doc_type_classes = [get_document_class(x) for x in search_conf.get_doctypes_for_index(search_conf.default_index)]


class SiteSearch(FacetedSearch):
    index = search_conf.default_index
    doc_types = doc_type_classes
    fields = (
        '*name',
        '*_type?',
        'title',
        'description',
        'content',
    )

    facets = {
        'kind': TermsFacet(field='_meta.model'),
        'countries': TermsFacet(field='countries.name'),
    }


class SearchResultsView(TemplateView):

    template_name = "search/results.html"
    http_method_names = ['get', 'head']
    search_results = None

    def get(self, request, *args, **kwargs):
        self.process_search_request(request, request.GET)
        return super().get(request, *args, **kwargs)

    def process_search_request(self, request, querydict):
        q = querydict.get('q')
        search = SiteSearch(q)
        # FIXME: elasticsearch_dsl's AttrDicts aren't key, value iterable, so facet and highlight info is hard to use in templates
        self.search_response = search.execute()

    def get_context_data(self, **kwargs):
        context = super(SearchResultsView, self).get_context_data(**kwargs)
        context['search_response'] = self.search_response
        return context
