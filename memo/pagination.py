from rest_framework.pagination import PageNumberPagination

class MemoPagination(PageNumberPagination):
    page_size = 25
    max_page_size = 25
    page_query_param = 'p'