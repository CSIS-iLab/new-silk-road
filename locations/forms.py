from django import forms
from django_select2.forms import (
    ModelSelect2Widget,
    ModelSelect2MultipleWidget,
)
from locations.models import (
    Country,
    Place,
    GeometryStore
)


class CountrySearchMultiWidget(ModelSelect2MultipleWidget):
    model = Country
    search_fields = [
        'name__icontains',
        'alpha_3__iexact',
    ]


class CountrySearchMultiField(forms.ModelMultipleChoiceField):
    widget = CountrySearchMultiWidget
    help_text = "Select field and begin typing a country's name to search"


class GeometrySearchWidget(ModelSelect2Widget):
    search_fields = [
        'label__icontains',
    ]
    model = GeometryStore


class GeometrySearchField(forms.ModelChoiceField):
    widget = GeometrySearchWidget
    help_text = "Select field and begin typing a geometry's label to search"


class GeometryStoreUploadForm(forms.Form):
    label = forms.CharField(required=False)
    geo_file = forms.FileField(
        widget=forms.ClearableFileInput(
            attrs={'accept': '.geojson,.kml'}
        ),
        required=True,
        help_text='Single file that holds geometry, such as GeoJSON or KML'
    )


class PlaceSearchWidget(ModelSelect2Widget):
    model = Place
    search_fields = [
        'label__icontains',
        'city__icontains',
    ]


class PlaceSearchField(forms.ModelChoiceField):
    widget = PlaceSearchWidget
    help_text = "Select field and begin typing a place's label or city"
