import openpyxl
import csv

wb = openpyxl.load_workbook('../../../ragd/PowerPlantSourceData/GlobalData_Solar_CPV_180427.xlsx')
# Get the active sheet
ws = wb.active  

# Retrieving the country-region lookup values as a key-value pair
wb1 = openpyxl.load_workbook('../../../ragd/PowerPlantDataFields-Source Matrix_Final.xlsx')
ws1 = wb1["Country-Region Lookup"]
# Retrieving the source-variables titles as a list of data.
ws2 = wb1["Source - Variables Matrix"]

# We used Source Matrix File to populate countries names as the keys and regions as the values into the dictionary.
countries = {}
for row_number,row in enumerate(ws1.rows):
    if row_number != 0:
        countries[row[1].value]=row[0].value

def clean_data_values(row_number, column_number):
    return ws.cell(row=row_number + 1, column=column_number + 1).value

# def region_data_values(row_number, column_number, countries):
#     return "At least something"
    

def clean_infr_name(row_number, column_number):
    return "Power Plant"

def clean_fuel_name(row_number, column_number):
    return "Solar"

def clean_pfuel_name(row_number, column_number):
    return "Solar CPV"

def plant_capacity_unit(row_number, column_number):
    return "MW"

def co2_unit(row_number, column_number):
    return "Tons per annum"

def currency_code(row_number, column_number):
    return "USD"

def bool_case(row_number, column_number):
    return "TRUE"

# This is for values that needs to be empty
def clean_empty_name(row_number, column_number):
    return ""

def need_filter(row_number, column_number):
    return "need some filtering"

def skip_row(row, excel_header):
    country_number = excel_header.index('Country')
    deco_year_number = excel_header.index('Decommissioning Year')
    bool_value = False
    if row[country_number].value not in countries.keys():
        # import ipdb; ipdb.set_trace()
        bool_value = True

    if row[deco_year_number].value and row[deco_year_number].value <= 2006: 
        bool_value = True

    return bool_value

headers = (
    ("Power Plant Name","Power Plant Name",clean_data_values),
    ("Infrastructure Type","",clean_infr_name),
    ("Country","Country",clean_data_values),
    ("Region","Region", clean_data_values),
    ("Plant Status","Status",clean_data_values),
    ("Plant Day Online","", clean_empty_name),
    ("Plant Month Online","Month Online",clean_data_values),
    ("Plant Year Online","Year Online", clean_data_values),
    ("Decommissioning Day","", clean_empty_name),
    ("Decommissioning Month","", clean_empty_name),
    ("Decommissioning Year","Decommissioning Year", clean_data_values),
    ("Owner 1","Owner", clean_data_values),
    ("Owner 1 Stake","Owner Stake", clean_data_values),
    ("Owner 2","", clean_empty_name),
    ("Owner 2 Stake","", clean_empty_name),
    ("Plant Fuel 1","", clean_fuel_name),
    ("Plant Fuel 2","", clean_empty_name),
    ("Plant Fuel 3","", clean_empty_name),
    ("Plant Fuel 4","", clean_empty_name),
    ("Project Fuel 1","", clean_pfuel_name),
    ("Project Fuel 2","", clean_empty_name),
    ("Project Fuel 3","", clean_empty_name),
    ("Project Fuel 4","", clean_empty_name),
    ("Plant Capacity","", need_filter),
    ("Plant Capacity Unit","", plant_capacity_unit),
    ("Project Capacity","", need_filter),
    ("Project Capacity Unit","", plant_capacity_unit),
    ("Plant Output","", clean_empty_name),
    ("Plant Output Unit","", clean_empty_name),
    ("Plant Output Year","", clean_empty_name),
    ("Estimated Plant Output","Average Output", clean_data_values),
    ("Estimated Plant Output Unit","", need_filter),
    ("Project Output","", clean_empty_name),
    ("Project Output Unit","", clean_empty_name),
    ("Project Output Year","", clean_empty_name),
    ("Estimated Project Output","Average Output", clean_data_values),
    ("Estimated Project Output Unit","", need_filter),
    ("Plant CO2 Emissions","CO2 Emissions (Tonnes per annum)", clean_data_values),
    ("Plant CO2 Emissions Unit","", co2_unit),
    ("Project CO2 Emissions","CO2 Emissions (Tonnes per annum)", clean_data_values),
    ("Project CO2 Emissions Unit","", co2_unit),
    ("Grid Connected","", clean_empty_name),
    ("Manufacturer 1","", clean_empty_name),
    ("Manufacturer 2","", clean_empty_name),
    ("Manufacturer 3","", clean_empty_name),
    ("Manufacturer 4","", clean_empty_name),
    ("Manufacturer 5","", clean_empty_name),
    ("SOx Reduction System","", clean_empty_name),
    ("NOx Reduction System","", clean_empty_name),
    ("Project Name","Subsidiary Asset Name", clean_data_values),
    ("Project Status","Status", clean_data_values),
    ("Total Cost","Capex USD", clean_data_values),
    ("Total Cost Currency","", currency_code),
    ("Start Day","", clean_empty_name),
    ("Start Month","", clean_empty_name),
    ("Start Year","", clean_empty_name),
    ("Construction Start Day","", clean_empty_name),
    ("Construction Start Month","", clean_empty_name),
    ("Construction Start Year","", clean_empty_name),
    ("Completion Day","", clean_empty_name),
    ("Completion Month","Month Online", clean_data_values),
    ("Completion Year","Year Online", clean_data_values),
    ("New Construction","", bool_case),
    ("Latitude","Latitude", clean_data_values),
    ("Longitude","Longitude", clean_data_values),
    ("Initiative","", clean_empty_name),
    ("Contractor 1","EPC Contractor", clean_data_values),
    ("Contractor 2","", need_filter),
    ("Contractor 3","", need_filter),
    ("Contractor 4","", need_filter),
    ("Contractor 5","", need_filter),
    ("Contractor 6","", need_filter),
    ("Contractor 7","", need_filter),
    ("Contractor 8","", need_filter),
    ("Contractor 9","", need_filter),
    ("Contractor 10","", need_filter),
    ("Contractor 11","", need_filter),
    ("Contractor 12","", need_filter),
    ("Consultant","", clean_empty_name),
    ("Implementing Agency","", clean_empty_name),
    ("Operator 1","Operator", clean_data_values),
    ("Operator 2","", clean_empty_name),
    ("Funder 1","",clean_empty_name),
    ("Funding Amount 1","", clean_empty_name),
    ("Funding Currency 1","", clean_empty_name),
    ("Funder 2","", clean_empty_name),
    ("Funding Amount 2","", clean_empty_name),
    ("Funding Currency 2","", clean_empty_name),
    ("Sources","", clean_empty_name),
    ("Notes","Asset Notes", clean_data_values)
)

# A list with the output headers retrieved from the header tuple.
titles = [header[0] for header in headers]

# This dic is to be able to write the months as integer values in the csv file.
months = {'Jan':1, 'Feb':2, 'Mar':3, 'Apr':4, 'May':5, 'Jun':6, 'Jul':7, 'Aug':8, 'Sep':9, 'Oct':10, 'Nov':11, 'Dec':12}

# Populate the csv file with the excel data.
with open('test_tuple.csv', 'w') as csv_file:
    writer = csv.DictWriter(csv_file, fieldnames=titles)
    writer.writeheader()


    # Iterate trough the entire row getting the row number and row value
    for row_number,row in enumerate(ws.rows):
        row_data = {}
        if row_number == 0:
            excel_header = [cell.value for cell_number, cell in enumerate(row)]
        # Skip the rows that are not in the countries dic.
        if row_number > 0 and not skip_row(row, excel_header):
            for title, excel_title, clean_up_function in headers:
                column_number = 0
                # if clean_up_function(row_number, column_number) in countries.keys():
                if excel_title:
                    column_number = excel_header.index(excel_title)
                row_data[title] = clean_up_function(row_number, column_number)
            writer.writerow(row_data)

        #     # Skip the capacity values that are less than 100.
        #     capacity_value = get_capacity_value(row, plant_capacity_number, total_capacity_number)
        #     if capacity_value and capacity_value < 100:
        #         skip_row = True    
        #     if not skip_row:
    