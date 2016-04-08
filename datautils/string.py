import re

extraspace_reg = re.compile("\s{2,}")


def clean_string(value, stripnewlines=True, stripquotes=True, default=''):
    translations = {
        '?': '–',
        '\u2018': '\'',
        '\u2019': '\'',
    }
    if value and isinstance(value, str):
        str_val = value.strip(" ")
        if stripnewlines:
            translations['\n'] = ''
            translations['\r'] = ''
        if stripquotes:
            translations['"'] = ''
            translations['\''] = ''
        translator = str.maketrans(translations)
        str_val = str_val.translate(translator)
        str_val = extraspace_reg.sub(" ", str_val)
        return str_val
    return default
