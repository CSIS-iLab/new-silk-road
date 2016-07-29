from .base import ModelMapping, RelatedMapping
from .documents import (
    CountryDoc,
    InfrastructureTypeDoc,
    ProjectDoc,
    EntryDoc,
    CategoryDoc,
)


class CountryMapping(ModelMapping):

    class Meta:
        model = 'locations.Country'
        doc_type = CountryDoc
        fields = ('name', 'alpha_3')


class InfrastructureTypeMapping(ModelMapping):

    class Meta:
        model = 'infrastructure.InfrastructureType'
        doc_type = InfrastructureTypeDoc
        fields = ('name',)


class ProjectMapping(ModelMapping):
    countries = RelatedMapping(CountryMapping, many=True)
    infrastructure_type = RelatedMapping(InfrastructureTypeMapping)

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


class CategoryMapping(ModelMapping):

    class Meta:
        model = 'writings.Category'
        doc_type = CategoryDoc
        fields = ('name',)


class EntryMapping(ModelMapping):
    categories = RelatedMapping(CategoryMapping, many=True)

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
