import os, sys

def write_countries(source_data, source_variables, filename):
    countries = []
    for dataset in source_data:
        for record in source_data[dataset]:
            country = record[source_variables[dataset]["Country"]]
            countries.append(country)
    countries = sorted(list(set(countries)))
    with open(filename, 'w') as f:
        f.write("Source,Normalized\n")
        for country in countries:
            f.write(f"{country},{country}\n")
