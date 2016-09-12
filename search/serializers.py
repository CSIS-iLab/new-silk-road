from .base import ModelSerializer, RelatedSerializer


# locations serializers


class CountrySerializer(ModelSerializer):

    class Meta:
        model = 'locations.Country'
        doc_type = 'search.documents.CountryDoc'
        fields = ('name', 'alpha_3')


# facts serializers


class EventTypeSerializer(ModelSerializer):

    class Meta:
        model = 'facts.EventType'
        doc_type = 'search.documents.NamedTypeDoc'
        fields = ('name',)


class EventSerializer(ModelSerializer):
    event_type = RelatedSerializer(EventTypeSerializer)

    class Meta:
        model = 'facts.Event'
        doc_type = 'search.documents.EventDoc'
        fields = (
            'name',
            'event_type',
            'description',
            'url',
        )

    def get_url(self, instance):
        return instance.get_absolute_url()


class OrganizationSerializer(ModelSerializer):
    countries = RelatedSerializer(CountrySerializer, many=True)

    class Meta:
        model = 'facts.Organization'
        doc_type = 'search.documents.OrganizationDoc'
        fields = (
            'name',
            'countries',
            'description',
            'mission',
            'organization_types',
            'url',
        )

    def get_organization_types(self, instance):
        return list(instance.get_organization_types())

    def get_url(self, instance):
        return instance.get_absolute_url()


class OrganizationInnerSerializer(ModelSerializer):

    class Meta:
        model = 'facts.Organization'
        doc_type = 'search.documents.OrganizationDoc'
        fields = (
            'name',
        )


class PositionSerializer(ModelSerializer):
    organization = RelatedSerializer(OrganizationInnerSerializer, many=False)

    class Meta:
        model = 'facts.Position'
        doc_type = 'search.documents.PositionDoc'
        fields = (
            'title',
            'organization',
        )


class PersonSerializer(ModelSerializer):
    citizenships = RelatedSerializer(CountrySerializer, many=True)
    position_set = RelatedSerializer(PositionSerializer, many=True)
    events = RelatedSerializer(EventSerializer, many=True)

    class Meta:
        model = 'facts.Person'
        doc_type = 'search.documents.PersonDoc'
        fields = (
            'identifier',
            'given_name',
            'additional_name',
            'family_name',
            'description',
            'citizenships',
            'position_set',
            'events',
            'url',
        )

    def get_url(self, instance):
        return instance.get_absolute_url()


# infrastructure serializers


class InitiativeTypeSerializer(ModelSerializer):

    class Meta:
        model = 'infrastructure.InitiativeType'
        doc_type = 'search.documents.NamedTypeDoc'
        fields = ('name',)


class InfrastructureTypeSerializer(ModelSerializer):

    class Meta:
        model = 'infrastructure.InfrastructureType'
        doc_type = 'search.documents.NamedTypeDoc'
        fields = ('name',)


class InitiativeSerializer(ModelSerializer):
    initiative_type = RelatedSerializer(InitiativeTypeSerializer)
    principal_agent = RelatedSerializer(OrganizationInnerSerializer)
    member_countries = RelatedSerializer(CountrySerializer, many=True)
    geographic_scope = RelatedSerializer(CountrySerializer, many=True)

    class Meta:
        model = 'infrastructure.Initiative'
        doc_type = 'search.documents.InitiativeDoc'
        fields = (
            'name',
            'initiative_type',
            'principal_agent',
            'member_countries',
            'geographic_scope',
            'url',
        )

    def get_url(self, instance):
        return instance.get_absolute_url()


class RelatedInitiativeSerializer(ModelSerializer):
    # initiative_type = RelatedSerializer(InitiativeTypeSerializer)

    class Meta:
        model = 'infrastructure.Initiative'
        doc_type = 'search.documents.InitiativeDoc'
        fields = (
            'name',
            # 'initiative_type',
        )


class ProjectSerializer(ModelSerializer):
    countries = RelatedSerializer(CountrySerializer, many=True)
    infrastructure_type = RelatedSerializer(InfrastructureTypeSerializer)
    initiatives = RelatedSerializer(RelatedInitiativeSerializer, many=True)

    class Meta:
        model = 'infrastructure.Project'
        doc_type = 'search.documents.ProjectDoc'
        fields = (
            'name',
            'description',
            'countries',
            'infrastructure_type',
            'start_year',
            'start_month',
            'start_day',
            'status',
            'initiatives',
            'url',
        )

    def get_url(self, instance):
        return instance.get_absolute_url()


class CategorySerializer(ModelSerializer):

    class Meta:
        model = 'writings.Category'
        doc_type = 'search.documents.CategoryDoc'
        fields = ('name',)


class EntrySerializer(ModelSerializer):
    categories = RelatedSerializer(CategorySerializer, many=True)

    class Meta:
        model = 'writings.Entry'
        doc_type = 'search.documents.EntryDoc'
        fields = (
            'title',
            'author',
            'content',
            'description',
            'publication_date',
            'categories',
            'url',
        )

    def get_url(self, instance):
        return instance.get_absolute_url()
