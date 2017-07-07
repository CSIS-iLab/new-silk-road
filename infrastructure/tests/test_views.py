from django.test import TestCase

from . import factories


class ProjectDetailViewTestCase(TestCase):
    """Render the details for a project."""

    def setUp(self):
        super().setUp()
        self.project = factories.ProjectFactory(published=True)

    def test_get_project(self):
        """Fetch the project detail page."""

        with self.assertTemplateUsed('infrastructure/project_detail.html'):
            response = self.client.get(self.project.get_absolute_url())
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, self.project.name)

    def test_unpublished_project(self):
        """You should not be able to view unpublished projects."""

        self.project.published = False
        self.project.save()

        response = self.client.get(self.project.get_absolute_url())
        self.assertEqual(response.status_code, 404)
