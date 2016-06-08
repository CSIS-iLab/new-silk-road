from rest_framework.pagination import CursorPagination


class ApiPagination(CursorPagination):
    ordering = 'created_at'
    page_size = 50
