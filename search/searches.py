from elasticsearch_dsl import A, Q, Search, FacetedSearch, TermsFacet
from elasticsearch_dsl.faceted_search import Facet
from elasticsearch_dsl.result import Response
from elasticsearch_dsl.utils import AttrDict
from functools import partial
from .conf import SearchConf
from .utils import get_document_class

search_conf = SearchConf(auto_setup=True)
doc_type_classes = [get_document_class(x) for x in search_conf.get_doctypes_for_index(search_conf.default_index)]


class NestedFacet(Facet):
    agg_type = 'nested'

    def add_filter(self, filter_values):
        """ Create a terms filter instead of bool containing term filters.  """
        if filter_values:
            bool_q = Q()
            for name, agg in self._params['aggs'].items():
                agg_field = getattr(agg, 'field', None)
                if agg_field:
                    bool_q &= Q('terms', **{agg_field: filter_values})
            return Q('nested', path=self._params['path'], query=bool_q)


class ImprovedFacetedResponse(Response):
    """Clone of FacetedResponse with properly handles nested aggregations."""
    def __init__(self, search, *args, **kwargs):
        super(ImprovedFacetedResponse, self).__init__(*args, **kwargs)
        super(AttrDict, self).__setattr__('_search', search)

    @property
    def query_string(self):
        return self._search._query

    @property
    def facets(self):
        if not hasattr(self, '_facets'):
            super(AttrDict, self).__setattr__('_facets', AttrDict({}))
            for name, facet in self._search.facets.items():
                agg = self.aggregations['_filter_' + name][name]
                buckets = agg['buckets'] if 'buckets' in agg else None
                if not buckets:
                    buckets = [bucket for name in agg
                               if isinstance(agg[name], (dict, AttrDict)) and 'buckets' in agg[name]
                               for bucket in agg[name]['buckets']]

                self._facets[name] = facet.get_values(
                    buckets,
                    self._search.filter_values.get(name, ())
                )
        return self._facets


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

    # Look at DocType fields to determine if field is a Nested or Object field. Object fields don't get NestedFacet
    facets = {
        # underscore ensures this will be first facet in sorted dict
        '_category': TermsFacet(field='_meta.model.raw'),
        'headquarters': TermsFacet(field='headquarters_location.raw'),
        # Note that the facet below only acts ProjectDoc, which
        # specifies a 'raw' multifield while other Docs do not
        'project_location': NestedFacet(
            path='countries',
            aggs={'name': A('terms', field='countries.name.raw')}
        ),
        'project_region': NestedFacet(
            path='regions',
            aggs={'name': A('terms', field='regions.name.raw')}
        ),
        'project_status': TermsFacet(field='status.raw'),
        'project_funder': TermsFacet(field='funding.sources.name.raw'),
        'initiative_scope': NestedFacet(
            path='geographic_scope',
            aggs={'name': A('terms', field='geographic_scope.name.raw')}
        ),
        'area_of_operations': TermsFacet(field='scope_of_operations.raw'),
        'infrastructure_type': TermsFacet(field='infrastructure_type.name.raw'),
        'start_year': TermsFacet(field='start_year'),
        'event_location': NestedFacet(
            path='places',
            aggs={'name': A('terms', field='places.location_display.raw')}
        ),
        'event_type': TermsFacet(field='event_type.name.raw'),
        'initiative_type': TermsFacet(field='initiative_type.name.raw'),
        'analysis': NestedFacet(
            path='categories',
            aggs={'name': A('terms', field='categories.name.raw')}
        ),
    }

    def search(self):
        """
        Construct the Search object.
        """
        s = Search(doc_type=self.doc_types, index=self.index)
        return s.response_class(partial(ImprovedFacetedResponse, self))

    def paginate(self, offset, size=10):
        """
        Accepts an offset and optional size and returns a search object that can fetch those results

        :param offset: An integer to offset search results by
        :type offset: int.
        :param size: The number of results to return. (default= 10)
        :type size: int.

        :returns: a search object you can execute()
        """
        to = offset + size
        return self._s[offset:to]
