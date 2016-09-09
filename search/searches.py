from elasticsearch_dsl import Search, A
from elasticsearch_dsl.utils import DslBase
from .conf import SearchConf
from .utils import get_document_class


search_conf = SearchConf(auto_setup=True)


def create_nested_terms_buckets(path, fields):
    agg = A('nested', path=path)
    for f in fields:
        agg.bucket(f, 'terms', field='.'.join((path, f)))
    return agg


def create_filter_agg(**kwargs):
    agg = A('filter', match_all={})
    buckets = kwargs.get('buckets', None)
    if buckets:
        for name, value in buckets.items():
            if isinstance(value, DslBase):
                agg.bucket(name, value)
    return agg


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

    aggregations = (
        ('countries', ('name',)),
        ('kind', ('_meta.model',)),
        ('infrastructure_type', ('name',)),
    )

    def __init__(self, query=None, query_filters={}):
        self._query = query
        self._query_filters = query_filters

        self._s = self.build_search()

    def search(self):
        s = Search(doc_type=self.doc_types, index=self.index)
        return s

    def aggregate(self, s):
        for agg_def in self.aggregations:
            fname = agg = None
            if len(agg_def) == 2:
                fname, fields = agg_def
                nested_terms = create_nested_terms_buckets(fname, fields)
                agg = create_filter_agg(buckets={fname: nested_terms})
            elif len(agg_def) == 1:
                fname = agg_def[0]
                agg = create_filter_agg(buckets={'terms': fname})
            if fname and agg:
                s.aggs.bucket('_filter_{}'.format(fname), agg)

    def build_search(self):
        s = self.search()
        return s
