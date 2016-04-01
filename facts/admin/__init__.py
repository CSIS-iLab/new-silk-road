from django.contrib import admin

from facts.models import (
    Person, Position,
    Event,
    # Organizations
    Organization,
    CompanyDetails, FinancingOrganizationDetails, GovernmentDetails,
    MilitaryDetails, MultilateralDetails, NGODetails, PoliticalDetails,
    # Organization types
    FinancingType, CompanyType, MultilateralType,
    NGOType, PoliticalType, CompanyStructure,
)
from .people import PersonAdmin
from .events import EventAdmin
from .organizations import (
    OrganizationAdmin,
    OrganizationType,
    OrganizationDetailsAdmin,
    FinancingOrganizationDetailsAdmin,
    CompanyDetailsAdmin,
    GovernmentDetailsDetailsAdmin,
    PoliticalDetailsAdmin,
)

# People
admin.site.register(Person, PersonAdmin)
admin.site.register(Position)
# Events
admin.site.register(Event, EventAdmin)
# Organizations
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(CompanyDetails, CompanyDetailsAdmin)
admin.site.register(CompanyType, OrganizationType)
admin.site.register(CompanyStructure)
admin.site.register(FinancingOrganizationDetails, FinancingOrganizationDetailsAdmin)
admin.site.register(FinancingType, OrganizationType)
admin.site.register(GovernmentDetails, GovernmentDetailsDetailsAdmin)
admin.site.register(MilitaryDetails, OrganizationDetailsAdmin)
admin.site.register(MultilateralDetails)
admin.site.register(MultilateralType, OrganizationType)
admin.site.register(NGODetails, OrganizationDetailsAdmin)
admin.site.register(NGOType, OrganizationType)
admin.site.register(PoliticalDetails, PoliticalDetailsAdmin)
admin.site.register(PoliticalType, OrganizationType)
