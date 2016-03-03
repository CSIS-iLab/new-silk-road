from django.contrib import admin
from django.forms.models import ModelForm
from facts.models.organizations import Organization
from facts.models import (
    # Organizations
    Company, FinancingOrganization, Government,
    Military, Multilateral, NGO, Political,
)
