from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from .models import Project


class ProjectDetailView(DetailView):
    model = Project


class ProjectListView(ListView):
    model = Project
    paginate_by = 50
