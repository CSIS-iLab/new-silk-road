from django import forms


class GeometryStoreUploadForm(forms.Form):
    label = forms.CharField(required=False)
    geo_file = forms.FileField(
        widget=forms.ClearableFileInput(
            attrs={'accept': '.geojson,.kml'}
        ),
        required=True,
        help_text='Single file that holds geometry, such as GeoJSON or KML'
    )
