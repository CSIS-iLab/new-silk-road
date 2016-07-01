from django.views.generic import TemplateView


class HomeView(TemplateView):
    template_name = "website/home.html"


class DatabaseView(TemplateView):
    template_name = "website/database.html"
