from elasticsearch_dsl import (
    DocType, field,
)


class CategoryDoc(field.InnerObjectWrapper):
    name = field.String()


class CountryDoc(field.InnerObjectWrapper):
    name = field.String()


class SerializedDoc(DocType):

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
    description = field.String()
    event_type = field.Object(properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})})
    start_year = field.Integer()

    def get_display_name(self):
        return self.name


class OrganizationDoc(SerializedDoc):
    name = field.String()
    description = field.String()
    mission = field.String()
    countries = field.Nested(
        doc_class=CountryDoc, properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})}
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
    description = field.String()
    citizenships = field.Nested(doc_class=CountryDoc, properties={'name': field.String()})
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
    member_countries = field.Nested(
        doc_class=CountryDoc, properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})}
    )
    geographic_scope = field.Nested(
        doc_class=CountryDoc, properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})}
    )
    initiative_type = field.Object(properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})})
    start_year = field.Integer()

    def get_display_name(self):
        return self.name


class ProjectDoc(SerializedDoc):
    identifier = field.String()
    name = field.String()
    alternate_name = field.String()
    description = field.String()
    status = field.String(fields={'raw': field.String(index='not_analyzed')})
    start_year = field.Integer()
    countries = field.Nested(
        doc_class=CountryDoc,
        properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})}
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

    def get_display_name(self):
        return self.name


class EntryDoc(SerializedDoc):
    title = field.String()
    author = field.String()
    content = field.String()
    description = field.String()
    publication_date = field.Date()
    categories = field.Nested(
        doc_class=CategoryDoc,
        properties={'name': field.String(fields={'raw': field.String(index='not_analyzed')})}
    )

    def get_display_name(self):
        return self.title
