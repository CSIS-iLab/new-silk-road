import openpyxl
import csv

wb = openpyxl.load_workbook('../../../ragd/PowerPlantSourceData/GlobalData_Solar_CPV_180427.xlsx')
# Get the active sheet
ws = wb.active  

# Retrieving the country-region lookup values as a key-value pair
wb1 = openpyxl.load_workbook('../../../ragd/PowerPlantDataFields-Source Matrix_Final.xlsx')
ws1 = wb1["Country-Region Lookup"]

# We used Source Matrix File to populate countries names as the keys and regions as the values into the dictionary.
countries = {}
for row_number,row in enumerate(ws1.rows):
    if row_number != 0:

        countries[row[1].value]=row[0].value

with open('test.csv', 'w') as csv_file:
    writer = csv.writer(csv_file)  
    # Iterate trough the entire row getting the row number and row value
    for row_number,row in enumerate(ws.rows): 
        # if row_number != 0:
            # if row[0].value == row_data[0]:
            #     continue 
        row_data = []
        # Getting the country number from the header row.
        if row_number == 0:
            import pdb; pdb.set_trace()
            for cell_number, cell in enumerate(row):
                if cell.value == 'Country':
                    country_number = cell_number
                if cell.value == 'Region':
                    region_number = cell_number
                row_data.append(str(cell.value))
            writer.writerow(row_data)

        # If the country name in country keys, then write the row.
        # else:
        if row[country_number].value in countries.keys():
            for cell_number, cell in enumerate(row):
                # Validate the font style and replace the italic values with ''.
                if cell.font.italic:  
                    row_data.append('')
                # If the cell number is the same of the region cell get the values from countries dic and append those values to the row_data
                if cell_number == region_number:
                    country_name = row[country_number].value
                    region_name = countries.get(country_name)
                    row_data.append(region_name)
                else:
                    row_data.append(str(cell.value).replace('\n', ''))
            writer.writerow(row_data)
        
