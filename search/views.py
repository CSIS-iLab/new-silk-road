from django.views.generic.base import TemplateView
from collections import defaultdict
from .searches import SiteSearch
from .utils import FACET_NAME_TRANSLATOR


def process_raw_facets(facet_name, facets_list, query_dict=None):
    for label, count, selected in facets_list:
        qd = query_dict.copy() if query_dict else None
        if qd:
            facet_value = ':'.join((facet_name, str(label)))
            if facet_value not in qd.getlist('facet'):
                qd.appendlist('facet', facet_value)
        yield {
            'label': label,
            'count': count,
            'selected': selected,
            'querystring': qd.urlencode(safe=':') if qd else None
        }


def process_selected_facets(facet_query_list):
    for item in facet_query_list:
        yield {
            'name': item.translate(FACET_NAME_TRANSLATOR).strip().title(),
            'raw': item,
        }


class SearchView(TemplateView):

    template_name = "search/search_results.html"
    http_method_names = ['get', 'head']

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.search_response = None
        self.query_dict = dict()
        self.offset = 0
        self.size = 20
        self.count = None
        self.page_params = []

    def get(self, request, *args, **kwargs):
        self.process_search_request(request)
        return super().get(request, *args, **kwargs)

    def process_search_request(self, request):
        self.query_dict = request.GET
        q = self.query_dict.get('q', None)

        if q:
            facets = defaultdict(list)
            facets_raw = self.query_dict.getlist('facet')
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

            search = SiteSearch(q, facets)
            search = search.paginate(self.offset, size=self.size)
            self.search_response = search.execute()
            self.count = self.search_response.hits.total

    def get_context_data(self, **kwargs):
        context = super(SearchView, self).get_context_data(**kwargs)

        page = {}
        if self.search_response:
            pnum = self.offset // self.size
            pmax = self.count // self.size
            page['number'] = pnum + 1
            page['num_pages'] = pmax + 1
            qd = self.query_dict.copy()
            if pnum > 0:
                qd['offset'] = (pnum - 1) * self.size
                page['previous'] = qd.urlencode(safe=[':', '%'])
            if pnum < pmax:
                qd['offset'] = (pnum + 1) * self.size
                page['next'] = qd.urlencode(safe=[':', '%'])

        context['search'] = {
            'query': {
                'q': self.query_dict.get('q', ''),
            },
            'offset': self.offset,
            'size': self.size,
            'page': page,
            'total': self.count,
            'results': self.search_response,
            'facets': None,
            'selected_facets': list(process_selected_facets(self.query_dict.getlist('facet'))),
        }
        facets = getattr(self.search_response, 'facets', None)
        if facets:
            facets_dict = facets.to_dict()
            facets_info = []
            for name, facet_list in facets_dict.items():
                facets_info.append({
                    'raw': name,
                    'name': name.translate(FACET_NAME_TRANSLATOR).strip(),
                    'info': list(process_raw_facets(name, facet_list, self.query_dict.copy())),
                })

            context['search']['facets'] = facets_info

        return context
