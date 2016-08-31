from .base import ModelSerializer, RelatedSerializer


class CountrySerializer(ModelSerializer):

    class Meta:
        model = 'locations.Country'
        doc_type = 'search.documents.CountryDoc'
        fields = ('name', 'alpha_3')


class InfrastructureTypeSerializer(ModelSerializer):

    class Meta:
        model = 'infrastructure.InfrastructureType'
        doc_type = 'search.documents.InfrastructureTypeDoc'
        fields = ('name',)


class OrganizationInnerSerializer(ModelSerializer):

    class Meta:
        model = 'facts.Organization'
        doc_type = 'search.documents.PositionDoc'
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

    class Meta:
        model = 'facts.Person'
        doc_type = 'search.documents.PersonDoc'
        fields = (
            'given_name',
            'additional_name',
            'family_name',
            'description',
            'citizenships',
            'position_set',
        )


class ProjectSerializer(ModelSerializer):
    countries = RelatedSerializer(CountrySerializer, many=True)
    infrastructure_type = RelatedSerializer(InfrastructureTypeSerializer)

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
            # 'initiatives',
        )


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
        )
