from django import forms


class GeometryStoreUploadForm(forms.Form):
    label = forms.CharField(required=False)
    geo_file = forms.FileField(
        required=True,
        help_text='Single file that holds geometry, such as GeoJSON or KML'
    )
