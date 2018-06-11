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

# We used Source Matrix File to populate titles names as a list from the source variables matrix 
titles =[]
for row_number, row in enumerate(ws2.rows):
    if row_number == 0:
        for cell_number, cell in enumerate(row):
            if cell_number != 0:
                titles.append(cell.value)

# Populate the csv file with the excel data.
with open('test.csv', 'w') as csv_file:
    writer = csv.writer(csv_file)  
    # Iterate trough the entire row getting the row number and row value
    for row_number,row in enumerate(ws.rows):
        row_data = []
        # Getting the number for the cell from the excel's header row.
        if row_number == 0:
            for cell_number, cell in enumerate(row):
                if cell.value == 'Power Plant Name':
                    plant_number = cell_number
                elif cell.value == 'Region':
                    region_number = cell_number
                elif cell.value == 'Country':
                    country_number = cell_number
                elif cell.value == 'Status':
                    status_number = cell_number
                elif cell.value == 'Month Online':
                    month_number = cell_number
                elif cell.value == 'Year Online':
                    year_number = cell_number
                elif cell.value == 'Decommissioning Year':
                    deco_year_number = cell_number
                elif cell.value == 'Owner':
                    owner_number = cell_number
                elif cell.value == 'Owner Stake':
                    owner_stake_number = cell_number
                elif cell.value == 'Plant Capacity (MW)':
                    plant_capacity_number = cell_number
                elif cell.value == 'Total Capacity (MW)':
                    total_capacity_number = cell_number
                elif cell.value == 'Active Capacity (MW)':
                    active_capacity_number = cell_number
                elif cell.value == 'Pipeline Capacity (MW)':
                    pipeline_capacity_number = cell_number
                elif cell.value == 'Discontinued Capacity (MW)':
                    discon_capacity_number = cell_number
                elif cell.value == 'Average Output':
                    average_output_number = cell_number
                elif cell.value == 'CO2 Emissions (Tonnes per annum)':
                    co2_number = cell_number
                elif cell.value == 'Subsidiary Asset Name':
                    project_name_value = cell_number
                elif cell.value == 'Capex USD':
                    capex_number = cell_number
                elif cell.value == 'Latitude':
                    latitude_number = cell_number
                elif cell.value == 'Longitude':
                    longitude_number = cell_number
                elif cell.value == 'EPC Contractor':
                    contractor_one_number = cell_number
                elif cell.value == 'Operator':
                    operator_number = cell_number
                elif cell.value == 'Asset Notes':
                    asset_number = cell_number
                
            writer.writerow(titles)

        
        # If the country name in country keys, then write the row.
        if row[country_number].value in countries.keys():
            # if row[cell_number].font.italic == False:
            skip_row = False
            # This will skip the headers
            if row_number == 0:
                skip_row = True
            elif row[deco_year_number].value:
                # Skip decommisioning year before 2006
                if row[deco_year_number].value < 2006:
                    skip_row = True
            if not skip_row:
                # import pdb; pdb.set_trace()
                # At this point we are iterating inside of the titles list that has the headers from the matrix sheet
                for cell_number, cell in enumerate(titles):
                    if cell_number == titles.index('Power Plant Name'):
                        excel_cell_value = row[plant_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Infrastructure Type'):
                        row_data.append('Power Plant')
                    elif cell_number == titles.index('Country'):
                        excel_cell_value = row[country_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Region'):
                        excel_cell_value = countries.get(row[country_number].value)
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Plant Status'):
                        excel_cell_value = row[status_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Plant Day Online'):
                        row_data.append('') # This will have to be an int value
                    elif cell_number == titles.index('Plant Month Online'):
                        excel_cell_value = row[month_number].value
                        row_data.append(excel_cell_value) # This will have to be an int 
                    elif cell_number == titles.index('Plant Year Online'):
                        excel_cell_value = row[year_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Decommissioning Day'):
                        row_data.append('') # int value, but there is no value added from any sheet
                    elif cell_number == titles.index('Decommissioning Month'):
                        row_data.append('') # int value, but there is no value added from any sheet
                    elif cell_number == titles.index('Decommissioning Year'):
                        excel_cell_value = row[deco_year_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Owner 1'):
                        excel_cell_value = row[owner_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Owner 1 Stake'):
                        excel_cell_value = row[owner_stake_number].value
                        row_data.append(excel_cell_value) # This should be a float value
                    elif cell_number == titles.index('Owner 2'):
                        row_data.append('')
                    elif cell_number == titles.index('Owner 2 Stake'):
                        row_data.append('') # This should be a float value
                    elif cell_number == titles.index('Plant Fuel 1'):
                        row_data.append('Solar')
                    elif cell_number == titles.index('Plant Fuel 2'):
                        row_data.append('')
                    elif cell_number == titles.index('Plant Fuel 3'):
                        row_data.append('')
                    elif cell_number == titles.index('Plant Fuel 4'):
                        row_data.append('')
                    elif cell_number == titles.index('Project Fuel 1'):
                        row_data.append('Solar CPV')
                    elif cell_number == titles.index('Project Fuel 2'):
                        row_data.append('')
                    elif cell_number == titles.index('Project Fuel 3'):
                        row_data.append('')
                    elif cell_number == titles.index('Project Fuel 4'):
                        row_data.append('')
                    elif cell_number == titles.index('Plant Capacity'):
                        excel_cell_value = row[plant_capacity_number].value
                        if excel_cell_value in ['', None]:
                            total_capacity_value = row[total_capacity_number].value
                            row_data.append(total_capacity_value)
                        else:
                            row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Plant Capacity Unit'):
                        row_data.append('MW')
                    elif cell_number == titles.index('Project Capacity'):
                        excel_cell_value = row[active_capacity_number].value
                        if excel_cell_value in ['', None]:
                            excel_cell_value = row[pipeline_capacity_number].value
                        elif excel_cell_value in ['', None]:
                            excel_cell_value = row[discon_capacity_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Project Capacity Unit'):
                        row_data.append('MW')
                    elif cell_number == titles.index('Plant Output'):
                        row_data.append('')
                    elif cell_number == titles.index('Plant Output Unit'):
                        row_data.append('')
                    elif cell_number == titles.index('Plant Output Year'):
                        row_data.append('')
                    elif cell_number == titles.index('Estimated Plant Output'):
                        excel_cell_value = row[average_output_number].value
                        if excel_cell_value in ['', None]:
                            row_data.append(excel_cell_value)
                        else:
                            unit_array_value = excel_cell_value.split(' ')
                            unit_value = unit_array_value[0]
                            row_data.append(unit_value)
                    elif cell_number == titles.index('Estimated Plant Output Unit'):
                        excel_cell_value = row[average_output_number].value
                        if excel_cell_value in ['', None]:
                            row_data.append(excel_cell_value)
                        else:
                            unit_array_value = excel_cell_value.split(' ')
                            unit_value = unit_array_value[1]
                            row_data.append(unit_value)
                    elif cell_number == titles.index('Project Output'):
                        row_data.append('')
                    elif cell_number == titles.index('Project Output Unit'):
                        row_data.append('')
                    elif cell_number == titles.index('Project Output Year'):
                        row_data.append('')
                    elif cell_number == titles.index('Estimated Project Output'):
                        excel_cell_value = row[average_output_number].value
                        if excel_cell_value in ['', None]:
                            row_data.append(excel_cell_value)
                        else:
                            unit_array_value = excel_cell_value.split(' ')
                            unit_value = unit_array_value[0]
                            row_data.append(unit_value)
                    elif cell_number == titles.index('Estimated Project Output Unit'):
                        excel_cell_value = row[average_output_number].value
                        if excel_cell_value in ['', None]:
                            row_data.append(excel_cell_value)
                        else:
                            unit_array_value = excel_cell_value.split(' ')
                            unit_value = unit_array_value[1]
                            row_data.append(unit_value)
                    elif cell_number == titles.index('Plant CO2 Emissions'):
                        excel_cell_value = row[co2_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Plant CO2 Emissions Unit'):
                        row_data.append('Tons per annum')
                    elif cell_number == titles.index('Project CO2 Emissions'):
                        excel_cell_value = row[co2_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Project CO2 Emissions Unit'):
                        row_data.append('Tons per annum')
                    elif cell_number == titles.index('Grid Connected'):
                        row_data.append('')
                    elif cell_number == titles.index('Manufacturer 1'):
                        row_data.append('')
                    elif cell_number == titles.index('Manufacturer 2'):
                        row_data.append('')
                    elif cell_number == titles.index('Manufacturer 3'):
                        row_data.append('')
                    elif cell_number == titles.index('Manufacturer 4'):
                        row_data.append('')
                    elif cell_number == titles.index('Manufacturer 5'):
                        row_data.append('')
                    elif cell_number == titles.index('SOx Reduction System'):
                        row_data.append('')
                    elif cell_number == titles.index('NOx Reduction System'):
                        row_data.append('')
                    elif cell_number == titles.index('Project Name'):
                        excel_cell_value = row[project_name_value].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Project Status'):
                        row_data.append(row[status_number].value)
                    elif cell_number == titles.index('Total Cost'):
                        excel_cell_value = row[capex_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Total Cost Currency'):
                        row_data.append('USD')
                    elif cell_number == titles.index('Start Day'):
                        row_data.append('')
                    elif cell_number == titles.index('Start Month'):
                        row_data.append('')
                    elif cell_number == titles.index('Start Year'):
                        row_data.append('')
                    elif cell_number == titles.index('Construction Start Day'):
                        row_data.append('')
                    elif cell_number == titles.index('Construction Start Month'):
                        row_data.append('')
                    elif cell_number == titles.index('Construction Start Year'):
                        row_data.append('')
                    elif cell_number == titles.index('Completion Day'):
                        row_data.append('')
                    elif cell_number == titles.index('Completion Month'):
                        excel_cell_value = row[month_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Completion Year'):
                        excel_cell_value = row[year_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('New Construction'):
                        row_data.append('TRUE')
                    elif cell_number == titles.index('Latitude'):
                        excel_cell_value = row[latitude_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Longitude'):
                        excel_cell_value = row[longitude_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Initiative'):
                        row_data.append('')
                    elif cell_number == titles.index('Contractor 1'):
                        excel_cell_value = row[contractor_one_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Contractor 2'):
                        excel_cell_value = row[contractor_one_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Contractor 3'):
                        row_data.append('')
                    elif cell_number == titles.index('Contractor 4'):
                        row_data.append('')
                    elif cell_number == titles.index('Contractor 5'):
                        row_data.append('')
                    elif cell_number == titles.index('Contractor 6'):
                        row_data.append('')
                    elif cell_number == titles.index('Contractor 7'):
                        row_data.append('')
                    elif cell_number == titles.index('Contractor 8'):
                        row_data.append('')
                    elif cell_number == titles.index('Contractor 9'):
                        row_data.append('')
                    elif cell_number == titles.index('Contractor 10'):
                        row_data.append('')
                    elif cell_number == titles.index('Contractor 11'):
                        row_data.append('')
                    elif cell_number == titles.index('Contractor 12'):
                        row_data.append('')
                    elif cell_number == titles.index('Consultant'):
                        row_data.append('')
                    elif cell_number == titles.index('Implementing Agency'):
                        row_data.append('')
                    elif cell_number == titles.index('Operator 1'):
                        excel_cell_value = row[operator_number].value
                        row_data.append(excel_cell_value)
                    elif cell_number == titles.index('Operator 2'):
                        row_data.append('')
                    elif cell_number == titles.index('Funder 1'):
                        row_data.append('')
                    elif cell_number == titles.index('Funding Amount 1'):
                        row_data.append('')
                    elif cell_number == titles.index('Funding Currency 1'):
                        row_data.append('')
                    elif cell_number == titles.index('Funder 2'):
                        row_data.append('')
                    elif cell_number == titles.index('Funding Amount 2'):
                        row_data.append('')
                    elif cell_number == titles.index('Funding Currency 2'):
                        row_data.append('')
                    elif cell_number == titles.index('Sources'):
                        row_data.append('')
                    elif cell_number == titles.index('Notes'):
                        excel_cell_value = row[asset_number].value
                        if excel_cell_value in ['', None]:
                            row_data.append('')
                        else:
                            row_data.append(str(excel_cell_value).replace('\n', ''))
                writer.writerow(row_data)
