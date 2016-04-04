from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from .models import (Project, Initiative)


class ProjectDetailView(DetailView):
    model = Project


class ProjectListView(ListView):
    model = Project
    paginate_by = 50


class InitiativeDetailView(DetailView):
    model = Initiative


class InitiativeListView(ListView):
    model = Initiative
    paginate_by = 50
