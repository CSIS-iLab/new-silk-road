from django.shortcuts import render
from django.views.generic.detail import DetailView

from knowledgebase.models import Article


class ArticleDetailView(DetailView):
    model = Article
