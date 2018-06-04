import openpyxl
import csv

wb = openpyxl.load_workbook('GlobalData_Solar_CPV_180427.xlsx')
ws = wb.active  # Get the active sheet 



with open('testSolar.csv', 'w') as csv_file:
    writer = csv.writer(csv_file)  
    # row_data = []

    # It supose to iterate and filter some values through each row of the excel sheet and write the selected rows into a csv file.

    for row_number,row in enumerate(ws.rows):   # Iterate trough the entire row getting the row number and row value
        if row_number != 0: # Validation to skip the rows with the same Power Plant Name
            if row[0].value == row_data[0]:
                continue 
        row_data = []
        for cell in row:
            if cell.font.italic:    # Validate the font style and skip the italic values.
                continue
            row_data.append(str(cell.value).replace('\n', ''))
        writer.writerow(row_data)
