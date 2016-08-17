from .base import ModelSerializer, RelatedSerializer
from .documents import (
    CountryDoc,
    InfrastructureTypeDoc,
    ProjectDoc,
    EntryDoc,
    CategoryDoc,
)


class CountrySerializer(ModelSerializer):

    class Meta:
        model = 'locations.Country'
        doc_type = CountryDoc
        fields = ('name', 'alpha_3')


class InfrastructureTypeSerializer(ModelSerializer):

    class Meta:
        model = 'infrastructure.InfrastructureType'
        doc_type = InfrastructureTypeDoc
        fields = ('name',)


class ProjectSerializer(ModelSerializer):
    countries = RelatedSerializer(CountrySerializer, many=True)
    infrastructure_type = RelatedSerializer(InfrastructureTypeSerializer)

    class Meta:
        model = 'infrastructure.Project'
        doc_type = ProjectDoc
        fields = (
            'id',
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
        doc_type = CategoryDoc
        fields = ('name',)


class EntrySerializer(ModelSerializer):
    categories = RelatedSerializer(CategorySerializer, many=True)

    class Meta:
        model = 'writings.Entry'
        doc_type = EntryDoc
        fields = (
            'id',
            'title',
            'author',
            'content',
            'description',
            'publication_date',
            'categories',
        )
