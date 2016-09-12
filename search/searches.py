from elasticsearch_dsl import Search, A, Q
from elasticsearch_dsl.result import Response
from functools import partial
from collections import defaultdict
from .conf import SearchConf
from .utils import get_document_class


search_conf = SearchConf(auto_setup=True)


class AggResponse(Response):

    def __init__(self, search, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._search = search

    def parse_aggregations(self):
        agg_dict = defaultdict(list)
        for name, agg in self._search.aggregations.items():
            if agg.name == 'nested':
                aggs_list = getattr(agg, 'aggs')
                for nested_agg in aggs_list:
                    agg_dict['.'.join((name, nested_agg))].extend(self.aggregations[name][nested_agg]['buckets'])
            else:
                agg_dict[name] = self.aggregations[name]['buckets']
        return agg_dict


class SiteSearch:
    index = search_conf.default_index
    doc_types = [
        get_document_class(x)
        for x in search_conf.get_doctypes_for_index(search_conf.default_index)
    ]
    fields = (
        '*name',
        '*.name^0.5',  # Negative boost to nested names (country.name, etc.)
        '*_type?',
        'title',
        'description',
        'content',
    )

    aggregations = {
        'countries': A('nested', path='countries', aggs={
            'name': A('terms', field='countries.name')
        }),
        'kind': A('terms', field='_meta.model'),
        'infrastructure_type': A('nested', path='infrastructure_type', aggs={
            'name': A('terms', field='infrastructure_type.name')
        }),
    }

    def __init__(self, query=None, post_filters=()):
        """`query` is an optional string to query on.
        `post_filters` is a dictionary where the key is the path or attribute,
        and the value is the query list.
        """
        self._query = query
        self._filters = []
        self._process_filters(post_filters)

        self._s = self.build_search()

    def _process_filters(self, filters):
        for path_attr, q_list in filters.items():
            query_obj = {path_attr: q_list if isinstance(q_list, (list, tuple)) else (q_list,)}
            path_parts = path_attr.split('.', maxsplit=1)
            if len(path_parts) == 2:
                self.add_filter('nested', {
                    'path': path_parts[0],
                    'query': Q('terms', **query_obj)
                })
            else:
                self.add_filter('terms', query_obj)

    def create_search(self):
        s = Search(doc_type=self.doc_types, index=self.index)
        return s.response_class(partial(AggResponse, self))

    def query(self, search, query):
        if query:
            return search.query('multi_match', fields=self.fields, query=query)
        return search

    def add_filter(self, filter_type, params):
        self._filters.append(Q(filter_type, **params))

    def post_filter(self, search, filters):
        post_filter = Q('match_all')
        for f in filters:
            post_filter &= f
        return search.post_filter(post_filter)

    def aggregate(self, search, aggregations):
        for name, agg in aggregations.items():
            search.aggs.bucket(name, agg)

    def highlight(self, search, fields):
        # Taken directly from FacetedSearch
        return search.highlight(*(f if '^' not in f else f.split('^', 1)[0]
                                for f in fields))

    def build_search(self):
        s = self.create_search()
        s = self.post_filter(s, self._filters)
        s = self.highlight(s, self.fields)
        s = self.query(s, self._query)
        self.aggregate(s, self.aggregations)
        return s

    def execute(self):
        return self._s.execute()
