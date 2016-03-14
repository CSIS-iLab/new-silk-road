from django.contrib import admin
from filer.admin.fileadmin import FileAdmin

from facts.models import (
    Person, Position,
    Event,
    # Organizations
    Company, FinancingOrganization, Government,
    Military, Multilateral, NGO, Political,
    # Organization types
    FinancingType, CompanyType, MultilateralType,
    NGOType, PoliticalType, CompanyStructure,
)
from .people import PersonAdmin
from .events import EventAdmin
from .organizations import OrganizationAdmin, FinancingOrganizationAdmin

# People
admin.site.register(Person, PersonAdmin)
admin.site.register(Position)
# Events
admin.site.register(Event, EventAdmin)
# Organizations
admin.site.register(Company, OrganizationAdmin)
admin.site.register(CompanyType)
admin.site.register(CompanyStructure)
admin.site.register(FinancingOrganization, FinancingOrganizationAdmin)
admin.site.register(FinancingType)
admin.site.register(Government, OrganizationAdmin)
admin.site.register(Military, OrganizationAdmin)
admin.site.register(Multilateral, OrganizationAdmin)
admin.site.register(MultilateralType)
admin.site.register(NGO, OrganizationAdmin)
admin.site.register(NGOType)
admin.site.register(Political, OrganizationAdmin)
admin.site.register(PoliticalType)
