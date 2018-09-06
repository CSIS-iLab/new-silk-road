from rest_framework.pagination import LimitOffsetPagination


class ApiPagination(LimitOffsetPagination):
    default_limit = 75
    max_limit = 200
