import typing


class DynamicFieldsMixin(object):
    """
    A serializer mixin that takes an additional `fields` argument that controls
    which fields should be displayed.
    You can also set `indelible_fields` on Meta to ensure certain fields are always present
    Usage::
        class MySerializer(DynamicFieldsMixin, serializers.HyperlinkedModelSerializer):
            class Meta:
                model = MyModel
                indelible_fields = ('id',)
    Adapted from https://gist.github.com/dbrgn/4e6fc1fe5922598592d6
    """
    def __init__(self, *args, **kwargs):
        super(DynamicFieldsMixin, self).__init__(*args, **kwargs)
        fields = self.context['request'].query_params.get('fields')
        if fields:
            fields = fields.split(',')
            allowed = set(fields)
            indelible_fields = getattr(self.Meta, 'indelible_fields', None)
            if indelible_fields and isinstance(indelible_fields, typing.Iterable):
                allowed.update(indelible_fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
