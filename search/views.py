from django.views.generic.base import TemplateView
from collections import defaultdict
from .searches import SiteSearch


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
            qd = self.query_dict.copy()
            if pnum > 0:
                qd['offset'] = (pnum - 1) * self.size
                page['previous'] = qd.urlencode(safe=[':', '%'])
            if pnum < pmax:
                qd['offset'] = (pnum + 1) * self.size
                page['next'] = qd.urlencode(safe=[':', '%'])

        context['search'] = {
            'query': self.query_dict,
            'offset': self.offset,
            'size': self.size,
            'page': page,
            'total': self.count,
            'results': self.search_response,
            'facets': None,
        }
        facets = getattr(self.search_response, 'facets', None)
        if facets:
            facets_dict = facets.to_dict()
            context['search']['facets'] = [
                {'name': key, 'info': value} for key, value in facets_dict.items()
            ]

        return context
