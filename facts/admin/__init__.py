from django.contrib import admin
from facts.models import (
    Person, Position,
    Region, Place,
    Project, Initiative, InitiativeType, InfrastructureType,
    Event,
    # Organizations
    Company, FinancingOrganization, Government,
    Military, Multilateral, NGO, Political,
    # Organization types
    FinancingType, CompanyType, MultilateralType,
    NGOType, PoliticalType, CompanyStructure,
)
# from .organizations import (CompanyAdmin)
from .people import PersonAdmin
from .events import EventAdmin
from .infrastructure import ProjectAdmin
from .organizations import OrganizationAdmin

# People
admin.site.register(Person, PersonAdmin)
admin.site.register(Position)
# Locations
admin.site.register(Place)
admin.site.register(Region)
# Events
admin.site.register(Event, EventAdmin)
# Infrastructure
admin.site.register(InfrastructureType)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Initiative)
admin.site.register(InitiativeType)
# Organizations
admin.site.register(Company, OrganizationAdmin)
admin.site.register(CompanyType)
admin.site.register(CompanyStructure)
admin.site.register(FinancingOrganization, OrganizationAdmin)
admin.site.register(FinancingType)
admin.site.register(Government, OrganizationAdmin)
admin.site.register(Military, OrganizationAdmin)
admin.site.register(Multilateral, OrganizationAdmin)
admin.site.register(MultilateralType)
admin.site.register(NGO, OrganizationAdmin)
admin.site.register(NGOType)
admin.site.register(Political, OrganizationAdmin)
admin.site.register(PoliticalType)
