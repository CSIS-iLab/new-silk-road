from django.contrib import admin
from filer.admin.fileadmin import FileAdmin

from facts.models import (
    Person, Position,
    Event,
    # Organizations
    Organization,
    Company, FinancingOrganization, Government,
    Military, Multilateral, NGO, Political,
    # Organization types
    FinancingType, CompanyType, MultilateralType,
    NGOType, PoliticalType, CompanyStructure,
)
from .people import PersonAdmin
from .events import EventAdmin
from .organizations import (
    BaseOrganizationAdmin,
    OrganizationAdmin,
    FinancingOrganizationAdmin
)

# People
admin.site.register(Person, PersonAdmin)
admin.site.register(Position)
# Events
admin.site.register(Event, EventAdmin)
# Organizations
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Company, BaseOrganizationAdmin)
admin.site.register(CompanyType)
admin.site.register(CompanyStructure)
admin.site.register(FinancingOrganization, FinancingOrganizationAdmin)
admin.site.register(FinancingType)
admin.site.register(Government, BaseOrganizationAdmin)
admin.site.register(Military, BaseOrganizationAdmin)
admin.site.register(Multilateral, BaseOrganizationAdmin)
admin.site.register(MultilateralType)
admin.site.register(NGO, BaseOrganizationAdmin)
admin.site.register(NGOType)
admin.site.register(Political, BaseOrganizationAdmin)
admin.site.register(PoliticalType)
