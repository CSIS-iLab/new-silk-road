from elasticsearch_dsl import (
    DocType, field,
)
from search.analyzers import html_strip


class CategoryDoc(field.InnerObjectWrapper):
    name = field.String()


class CountryDoc(field.InnerObjectWrapper):
    name = field.String()


class PlaceDoc(field.InnerObjectWrapper):
    city = field.String(fields={'raw': field.String(index='not_analyzed')})
    country = field.Object(doc_class=CountryDoc)
    label = field.String(fields={'raw': field.String(index='not_analyzed')})
    location_display = field.String(fields={'raw': field.String(index='not_analyzed')})


class RegionDoc(field.InnerObjectWrapper):
    name = field.String(fields={'raw': field.String(index='not_analyzed')})


class SerializedDoc(DocType):
    _meta = field.Object(
        properties={'model': field.String(fields={'raw': field.String(index='not_analyzed')})}
    )

    def get_model_meta(self):
        return getattr(self, '_meta', None)

    def get_result_highlight(self):
        highlight = getattr(self.meta, 'highlight', None)
        if highlight:
            return getattr(highlight, '_d_', None)
        return None

    def get_display_name(self):
        return None


class EventDoc(SerializedDoc):
    name = field.String()
    description = field.String(
        analyzer=html_strip,
        fields={'raw': field.String(index='not_analyzed')}
    )
    event_type = field.Object(properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})})
    start_year = field.Integer()
    places = field.Nested(
        doc_class=PlaceDoc,
        properties={'location_display': field.String(fields={'raw': field.String(index='not_analyzed')})}
    )

    def get_display_name(self):
        return self.name


class OrganizationDoc(SerializedDoc):
    name = field.String()
    description = field.String(
        analyzer=html_strip,
        fields={'raw': field.String(index='not_analyzed')}
    )
    mission = field.String()
    countries = field.Nested(doc_class=CountryDoc)
    headquarters_location = field.String(fields={'raw': field.String(index='not_analyzed')})
    scope_of_operations = field.String(
        multi=True,
        fields={'raw': field.String(index='not_analyzed')}
    )
    start_year = field.Integer()

    def get_display_name(self):
        return self.name


class PositionDoc(field.InnerObjectWrapper):
    title = field.String()
    organization = field.Object(
        doc_class=OrganizationDoc,
        properties={
            'name': field.String(),
        }
    )


class PersonDoc(SerializedDoc):
    identifier = field.String()
    given_name = field.String()
    additional_name = field.String()
    family_name = field.String()
    description = field.String(
        analyzer=html_strip,
        fields={'raw': field.String(index='not_analyzed')}
    )
    citizenships = field.Nested(doc_class=CountryDoc)
    position_set = field.Nested(
        doc_class=PositionDoc,
        properties={
            'title': field.String(),
            'organization': field.Object(properties={'name': field.String()})
        }
    )
    events = field.Nested(properties={'name': field.String()})

    def get_display_name(self):
        return " ".join((self.given_name, self.family_name))


class InitiativeDoc(SerializedDoc):
    identifier = field.String()
    name = field.String()
    principal_agent = field.Nested(multi=False, properties={'name': field.String()})
    member_countries = field.Nested(doc_class=CountryDoc)
    geographic_scope = field.Nested(
        doc_class=CountryDoc,
        properties={
            'name': field.String(fields={'raw': field.String(index='not_analyzed')})
        }
    )
    initiative_type = field.Object(properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})})
    start_year = field.Integer()

    def get_display_name(self):
        return self.name


class ProjectDoc(SerializedDoc):
    identifier = field.String()
    name = field.String()
    alternate_name = field.String()
    description = field.String(
        analyzer=html_strip,
        fields={'raw': field.String(index='not_analyzed')}
    )
    status = field.String(fields={'raw': field.String(index='not_analyzed')})
    start_year = field.Integer()
    countries = field.Nested(
        doc_class=CountryDoc,  # project_location aggregation/facet uses the raw multifield
        properties={
            'name': field.String(fields={'raw': field.String(index='not_analyzed')})
        }
    )
    infrastructure_type = field.Object(
        properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})}
    )
    # Providing a doc_class for initiatives produced errors, so keep it simple!
    initiatives = field.Nested(properties={'name': field.String()})
    funding = field.Object(
        multi=True,
        properties={
            'sources': field.Object(
                multi=True,
                properties={
                    'name': field.String(fields={'raw': field.String(index='not_analyzed')}),
                }
            )
        }
    )
    regions = field.Nested(
        doc_class=RegionDoc,
        properties={
            'name': field.String(fields={'raw': field.String(index='not_analyzed')})
        }
    )

    def get_display_name(self):
        return self.name


class EntryDoc(SerializedDoc):
    title = field.String()
    author = field.String()
    content = field.String(
        analyzer=html_strip,
        fields={'raw': field.String(index='not_analyzed')}
    )
    description = field.String(
        analyzer=html_strip,
        fields={'raw': field.String(index='not_analyzed')}
    )
    publication_date = field.Date()
    categories = field.Nested(
        doc_class=CategoryDoc,
        properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})}
    )

    def get_display_name(self):
        return self.title
