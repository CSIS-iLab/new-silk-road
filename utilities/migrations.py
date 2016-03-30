from django.utils.text import slugify
import uuid


def make_slug_forward(app_label, model_label, slug_source):
    def generate_slugs(apps, schema_editor):
        TheModel = apps.get_model(app_label, model_label)
        db_alias = schema_editor.connection.alias

        if hasattr(TheModel, '_base_manager'):
            for m in TheModel._base_manager.using(db_alias).all():
                if not hasattr(m, 'slug'):
                    break
                attr_val = getattr(m, slug_source)
                if isinstance(attr_val, str):
                    m.slug = slugify(attr_val)
                    m.save(update_fields=['slug'])
    return generate_slugs


def make_uuid_forward(app_label, model_label, uuid_field):
    def set_unique_uuid(apps, schema_editor):
        TheModel = apps.get_model(app_label, model_label)
        db_alias = schema_editor.connection.alias

        if hasattr(TheModel, '_base_manager'):
            for m in TheModel._base_manager.using(db_alias).all():
                if not hasattr(m, uuid_field):
                    break
                setattr(m, uuid_field, uuid.uuid4())
                m.save(update_fields=[uuid_field])

    return set_unique_uuid
