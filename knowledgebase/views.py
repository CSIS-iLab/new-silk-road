# from django.shortcuts import render
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from knowledgebase.models import Article, Category


class ArticleDetailView(DetailView):
    model = Article


class CategoryListView(ListView):
    model = Category


class CategoryDetailView(DetailView):
    model = Category
