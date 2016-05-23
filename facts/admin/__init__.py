from django.contrib import admin

from facts.models import (
    Person, Position,
    Event, EventType,
    # Organizations
    Organization,
    CompanyDetails, FinancingOrganizationDetails, GovernmentDetails,
    MilitaryDetails, MultilateralDetails, NGODetails, PoliticalDetails,
    # Organization types
    FinancingType, CompanyType, MultilateralType,
    NGOType, PoliticalType, CompanyStructure,
)
from .people import PersonAdmin
from .events import (
    EventAdmin, EventTypeAdmin
)
from .organizations import (
    OrganizationAdmin,
    OrganizationType,
    CompanyDetailsAdmin,
    FinancingOrganizationDetailsAdmin,
    GovernmentDetailsDetailsAdmin,
    MilitaryDetailsAdmin,
    MultilateralDetailsAdmin,
    NGODetailsAdmin,
    PoliticalDetailsAdmin,
    CompanyStructureAdmin,
)

# People
admin.site.register(Person, PersonAdmin)
admin.site.register(Position)
# Events
admin.site.register(Event, EventAdmin)
admin.site.register(EventType, EventTypeAdmin)
# Organizations
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(CompanyDetails, CompanyDetailsAdmin)
admin.site.register(CompanyType, OrganizationType)
admin.site.register(CompanyStructure, CompanyStructureAdmin)
admin.site.register(FinancingOrganizationDetails, FinancingOrganizationDetailsAdmin)
admin.site.register(FinancingType, OrganizationType)
admin.site.register(GovernmentDetails, GovernmentDetailsDetailsAdmin)
admin.site.register(MilitaryDetails, MilitaryDetailsAdmin)
admin.site.register(MultilateralDetails, MultilateralDetailsAdmin)
admin.site.register(MultilateralType, OrganizationType)
admin.site.register(NGODetails, NGODetailsAdmin)
admin.site.register(NGOType, OrganizationType)
admin.site.register(PoliticalDetails, PoliticalDetailsAdmin)
admin.site.register(PoliticalType, OrganizationType)
