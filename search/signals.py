from django.forms.models import model_to_dict


# def save_object_to_elastic_search(instance, created, **kwargs):
#     doc_type = instance._meta.label
#     id = instance.id
#     # TODO: Serialize related objects as lists of strings, or as Nested objects
#     # NOTE: Could be something like ['China', 'Viet Nam'] for countries
#     #       What about
#     data = model_to_dict(instance)
#
#     if created:
#         connections.get_connection().index(
#             doc_type=doc_type,
#             id=id,
#             body=data,
#         )
#     else:
#         connections.get_connection().update(
#             doc_type=doc_type,
#             id=id,
#             body=dict(
#                 doc=data,
#             ),
#         )
