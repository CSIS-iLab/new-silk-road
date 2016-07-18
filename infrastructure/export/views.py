from django.http import HttpResponse
from django.views.generic import View
from django.db import connection
import io
import datetime


def copy_projects_csv():
    cursor = connection.cursor()
    stream = io.StringIO()
    cursor.copy_expert(
        '''
        COPY (SELECT * FROM infrastructure_projects_export_view)
        TO STDOUT
        WITH (FORMAT csv, HEADER TRUE, NULL 'NULL', FORCE_QUOTE *)''',
        stream
    )
    return stream.getvalue()


class ProjectExportView(View):

    def get(self, request, *args, **kwargs):
        response = HttpResponse(copy_projects_csv(), content_type="text/csv")
        d = datetime.datetime.now()
        filename = "infrastructure_projects_{:%Y%m%d_%H%M}.csv".format(d)
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(filename)
        return response
