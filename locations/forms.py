from django import forms
from django_select2.forms import (
    ModelSelect2Widget,
    ModelSelect2MultipleWidget,
)
from locations.models import (
    Country,
    Place,
    GeometryStore,
    LineStringGeometry,
    PointGeometry,
    PolygonGeometry,
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


class LineSearchMultiWidget(ModelSelect2MultipleWidget):
    model = LineStringGeometry
    search_fields = [
        'label__icontains',
    ]


class PointSearchMultiWidget(ModelSelect2MultipleWidget):
    model = PointGeometry
    search_fields = [
        'label__icontains',
    ]


class PolygonSearchMultiWidget(ModelSelect2MultipleWidget):
    model = PolygonGeometry
    search_fields = [
        'label__icontains',
    ]


class LineSearchMultiField(forms.ModelMultipleChoiceField):
    widget = LineSearchMultiWidget
    help_text = "Select field and begin typing a country's name to search"


class PointSearchMultiField(forms.ModelMultipleChoiceField):
    widget = PointSearchMultiWidget
    help_text = "Select field and begin typing a country's name to search"


class PolygonSearchMultiField(forms.ModelMultipleChoiceField):
    widget = PolygonSearchMultiWidget
    help_text = "Select field and begin typing a country's name to search"


class GeometryStoreForm(forms.ModelForm):
    lines = LineSearchMultiField(
        required=False,
        queryset=LineStringGeometry.objects.all(),
        help_text=LineSearchMultiField.help_text
    )
    points = PointSearchMultiField(
        required=False,
        queryset=PointGeometry.objects.all(),
        help_text=PointSearchMultiField.help_text
    )
    polygons = PolygonSearchMultiField(
        required=False,
        queryset=PolygonGeometry.objects.all(),
        help_text=PolygonSearchMultiField.help_text
    )

    class Meta:
        model = GeometryStore
        fields = '__all__'
        widgets = {
            'sources': forms.Textarea(attrs={'cols': 200, 'rows': 4, 'style': 'width: 90%;'}),
        }
