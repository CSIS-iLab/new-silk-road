
import openpyxl
from collections import OrderedDict


def load_workbook_data(filepath, headers=True, break_on_blank=True):
    """get workbook data from the given file. 
    Arguments:

    * filepath: the Excel filesystem path
    * headers=True: indicates the presence of a header row.
        - if True, use the values in the first row as record keys.
        - if False, use the Excel names of the columns as record keys.
    * break_on_blank=True: if True, stop processing at the first empty row.

    Returns an OrderedDict containing the worksheets (in order), 
    with each worksheet as a list of OrderedDict records, each row as a record.
    (We're using OrderedDict so that worksheets and columns can be accessed by index if desired.)
    """
    def make_record(keys, row):
        record = OrderedDict()
        for i in range(len(row)):
            record[keys[i]] = row[i].value
        return record
    workbook = openpyxl.load_workbook(filepath)
    data = OrderedDict()
    for sheet in workbook._sheets:
        data[sheet.title] = []
        rows = sheet.rows.__iter__()    # sheet.rows doesn't behave as a normal generator, so force it
        row = rows.__next__()           # <= this consumes the row
        if headers==True:
            keys = [cell.value for cell in row]
        else:
            keys = [excel_key(i) for i in range(len(row))]
            record = make_record(keys, row)
            data[sheet.title].append(record)
        for row in rows:
            record = make_record(keys, row)
            if break_on_blank==True and set(record.values()) == {None}:
                break
            data[sheet.title].append(record)
    return data

def excel_key(index):
    """create a key for index by converting index into a base-26 number, using A-Z as the characters."""
    X = lambda n: ~n and X((n // 26)-1) + chr(65 + (n % 26)) or ''
    return X(int(index))

def worksheet_dict(worksheet_data, primary_key, merge=True):
    """convert a worksheet_data list into a dict, 
    using the primary_key (tuple or list of record keys) to create dict keys.
    Returns an OrderedDict.
    raises a ValueError if a duplicate primary key is found
    """
    data = OrderedDict()
    for record in worksheet_data:
        key = tuple([record.get(key) for key in primary_key])
        if key not in data:
            data[key] = record
        elif merge != True:
            print(f"Duplicate key: {key}")
            # raise ValueError(f"Duplicate key: {key}")
        else:
            print(f"Duplicate key: {key}")
            for attr, val in record.items():
                if val is not None:
                    if data[key][attr] is None:
                        data[key][attr] = val
                    elif data[key][attr] != val:
                        print(f"  CONFLICT: key=\"{attr}\":")
                        print(f"    val1: {data[key][attr]}")
                        print(f"    val2: {val}")
    return data

if __name__=='__main__':
    import os, sys, json
    with open(os.path.join(os.path.dirname(__file__), 'keys.json'), 'rb') as f:
        keys = json.load(f)
    for filename in sys.argv[1:]:
        filekey = '_'.join(os.path.basename(filename).split('_')[:2])
        primary_key = tuple(keys[filekey])
        print('\n== SOURCE:', os.path.basename(filename), '==\n Primary Key =', primary_key)
        try:
            wbdata = load_workbook_data(filename)
            title = list(wbdata.keys())[0]
            wsdata = worksheet_dict(wbdata[title], primary_key)
        except:
            print(os.path.basename(filename), ':', sys.exc_info()[1])
