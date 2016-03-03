from django.contrib import admin
from facts.models import (
    Person, Position,
    Region, Place,
    Project, Initiative, InitiativeType, InfrastructureType,
    Government, Company, Event,
    FinancingOrganization, Multilateral,
    NGO, Political, Military,
    FinancingType, CompanyType, MultilateralType,
    NGOType, PoliticalType, CompanyStructure,
)
from .organizations import (CompanyAdmin)
from .people import PersonAdmin
from .events import EventAdmin
from .infrastructure import ProjectAdmin

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
admin.site.register(Company, CompanyAdmin)
admin.site.register(CompanyType)
admin.site.register(CompanyStructure)
admin.site.register(FinancingOrganization)
admin.site.register(FinancingType)
admin.site.register(Government)
admin.site.register(Military)
admin.site.register(Multilateral)
admin.site.register(MultilateralType)
admin.site.register(NGO)
admin.site.register(NGOType)
admin.site.register(Political)
admin.site.register(PoliticalType)
