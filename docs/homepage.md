# Homepage Setup

The homepage has been built to include dynamic content, which can be managed via the admin interface.

## Managing the homepage

To manage the stories listed on the homepage, navigate to the [admin](https://reconnectingasia.csis.org/admin). If you
are not logged in, enter your username and password at the prompt. Once logged in, click on "Writings" in the navigation
on the left side of the page. Underneath "Writings" select "Collections". You should now see a list of available
collections. Select "Homepage: Analysis Banner". On the detail page for this collection, you can select articles to
include on the home page. By giving each article a value in the "order" field, you can designate their placement on the
page.

+ The first entry (designated with the lowest number, usually 1) will display in the top of the main column.
+ The second entry will display below the first entry.
+ The third entry will display in the top of the right sidebar.
+ The fourth entry will display below the third entry.

Note: If multiple entries are given the same order, it cannot be guaranteed that they will display consistently.
It's better to use 1, 2, 3, and 4 to ensure that the exact order of entries is consistent.

Note: If more than 4 entries are included in this collection, any beyond the fourth entry will be ignored and will not
display on the homepage.

## Homepage construction

This section is only relevant if significant changes need to be made to the homepage, or if you want to build another 
page using a similar structure. None of the below information is needed for normal use or maintenance of the site.

### Collections

The homepage takes advantage of the `EntryCollection` model. (You will not have to make any changes to the 
`EntryCollection` model, but if you want to see how it is constructed, it is found in /writings/models.py) This is 
already connected to the admin, so the articles included in the collection can be selected and re-ordered there. 

If you are creating a new collection, that will be done in the admin. From the admin homepage, click "Writings", 
then "Collections", then "Add entry collection". Provide a name (what website admins will see as the name of the 
collection) and a slug (usually the name, but all lowercase and using '-' instead of spaces. Make sure there are no
spaces or special characters in the slug). Finally, add a reference to the collection in /newsilkroad/settings.py.
You'll see a parameter called `CONSTANCE_CONFIG`. Add a new entry, following the pattern of the others:

```
'MY_NEW_COLLECTION': (
    'slug-for-my-collection',
    'Description of the collection', str
),
```

### FeaturedEntryMixin
In order to make sure you have access to the functions which make the articles in the collection available to the 
template, you will need to subclass the `FeaturedEntryMixin`. You will also need to specify which `EntryCollection` will
be used to generate the content for this site. That's where you'll reference the collections entry in `CONSTANCE_CONFIG` 
in /newsilkroad/settings.

The final result will look something like this:

```
from django.views.generic import TemplateView
from writings.views import FeaturedEntryMixin

class MyNewPage(FeaturedEntryMixin, TemplateView):
    template_name = "website/my_template.html"
    featured_config_key = 'MY_NEW_COLLECTION'
```

That will point the `FeaturedEntryMixin` to the correct collection, and include the entries in the context.

### Use in Template

The resulting entries will be available in the template as `featured_entry_set`.

Because `EntryCollection` references `OrderedEntry` objects rather than `Entry` objects directly, attributes will be 
accessed with what may seem to be an extra `.entry`. (See examples below.) If the extra `.entry` is omitted, nothing 
will appear in that place.

When referencing the content or description of the entry, you will want to use `content_rendered` or 
`description_rendered`, respectively, as those have been parsed to be html-ready. You will also want to use the Django
template function `safe` to ensure that Django does not duplicate the rendering that has already been done. The end
result will look something like `{{ entry.entry.content_rendered | safe }}`

There are two options for using the resulting context data in the template: iterating or retrieving individual entries.

#### Iterating
If the page structure will be basically the same for each entry, then iterating is preferable, as it reduces the 
repetition in the code. Iteration can be done as follows:

```
{% for entry in featured_entry_set %}
    <div class="some-class entry-{{ forloop.counter }}">
        <h3>{{ entry.entry.title }}</h3>
        {{ entry.entry.content_rendered | safe }}
    </div>
{% endfor %}
```

The first line, `{% for entry in featured_entry_set %}`, indicates that inside the block, whichever entry is currently
selected will be referred to as `entry` in the remainder of the block. We then open a div with `some-class` providing a 
hook for styles that all the entries have in common, and `entry-{{ forloop.counter }}` providing a class that will 
allow for styles to be selectively applied to, for instance, `entry-2`.

#### Individual Selection
Individual selection can be used if the styles are sufficiently different for the different entries that the markup
cannot be re-used. The entries will be in order, starting at index 0. For example, to list the titles of the first 3
entries with different header tags, you could do something like the following:

```
<h1>{{ featured_entry_set.0.entry.title }}</h1>
<h2>{{ featured_entry_set.1.entry.title }}</h2>
<h3>{{ featured_entry_set.2.entry.title }}</h3>
```

To list the first entry with its title and author, you might do something like the following:

```
<h1>{{ featured_entry_set.0.entry.title }}</h1>
<h2>{{ featured_entry_set.0.entry.author }}</h2>
<p>{{ featured_entry_set.0.entry.content_rendered | safe }}</p>
```

### Truncation
In some cases, you may want to display only a portion of the article or description. Django has a few functions which 
assist with that. To truncate an article to its first 100 words:

```
{{ entry.entry.content_rendered | safe | truncatewords_html:100 }}
```

To truncate that same article to its first 1000 characters instead:

```
{{ entry.entry.content_rendered | safe | truncatechars_html:1000 }}
```

Note that in these examples, we are using the `_html` versions of the tags. When in doubt, these are the ones to use.
These versions keep track of opening tags (for example, indicating bold or italic text) and make sure to close the tags 
even if the text is truncated in the middle of the tagged text. When this is definitely not going to be a problem, use
the simpler version instead, as it is faster. For example, if you wanted to list all the titles of the articles to be
displayed, but show only the first 50 characters of each title:

```
<ul>
    {% for entry in featured_entry_set %}
        <li>{{ entry.entry.title | truncatechars:50 }}</li>
    {% endfor %}
</ul>
```