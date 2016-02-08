from django.test import TestCase

from knowledgebase.models import Article


class ArticleModelTests(TestCase):

    def test_article_renders_body_markdown(self):
        raw_markdown = """# This is markdown

https://www.example.com

<iframe width="420" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>

"""
        expected_html = '<h1>This is markdown</h1>\n<p>https://www.example.com</p>\n<iframe width="420" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>'
        obj = Article(title="Test article saves rendered markdown", body=raw_markdown)
        obj._render_body_markdown()
        self.assertIsNotNone(obj.body)
        self.assertHTMLEqual(obj.body_rendered, expected_html)


    def test_article_save_rendered_markdown(self):
        raw_markdown = '# This is markdown\n\nHere is a paragraph'
        obj = Article(title="Test article saves rendered markdown", body=raw_markdown)
        obj.save()
        self.assertIsNotNone(obj.body)
        self.assertIsNotNone(obj.body_rendered)
