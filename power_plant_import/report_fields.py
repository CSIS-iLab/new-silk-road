
import sys, json
from power_plant_import import data
from power_plant_import.fields import FIELDS

if __name__ == '__main__':
    ppdata = data.read_json(sys.argv[1])
    fields = []
    for key in ppdata:
        for record in ppdata[key]:
            for field in [
                field
                for field in record
                if record[field] is not None
                # and field not in FIELDS
            ]:
                if (field) not in fields:
                    fields.append(field)
                    print(
                        fields[-1],
                        '|',
                        (record["Dataset"], record["Power Plant Name"], record["Project Name"]),
                    )
