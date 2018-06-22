# Power Plant Data Processing

Each column belongs either to a plant or a project.

* [x] Power Plant identity (primary key): power plants with the same 
	* [x] "Power Plant Name", 
	* [x] "Plant ID", or 
	* [x] "Latitude"+"Longitude"
* [x] GlobalData takes precedence over AllPowerPlants (ENI and WRI).

* [] Filter out records:
	* [x] the country is not in the "Country-Region Lookup" worksheet.
	* [x] "Completion Year" < 2006
	* [x] "Decommissioning Year" < 2006
	* [x] ENI/WRI where power plant is not in the GlobalData
	* [] "Plant Capacity" 
		* [] < 100 MW 
		* [] null?

* [] Filter out data:
	* [] italicized values in (keys per output, not source):
		* [] "Plant Day Online"
		* [] "Plant Month Online"
		* [] "Plant Year Online"
		* [] "Total Cost"
	* [] estimated data (not null) (don't want estimated data)
		* [] "Estimated Plant Output" if "Plant Output" is not null
		* [] "Estimated Plant Output Unit" if "Plant Output" is not null
		* [] "Estimated Project Output" if "Project Output" is not null
		* [] "Estimated Project Output Unit" if "Project Output" is not null
	* [] duplicates in:
		* [] Contractor 1..12
		* [] Manufacturer 1..5
		* [] Operator 1..2
		* [] Plant Fuel 1..4

* [] Normalize fields: based on "Source - Variables Matrix" worksheet
	* [x] "Power Plant Name"
	* [x] "Infrastructure Type"
	* [x] "Country"
	* [x] "Project Name", "Project Status"
	* [x] "Region" – based on Country-Region Lookup
	* [] "Plant Status"
	* [] "Plant Day Online"
	* [] "Plant Month Online"
	* [] "Plant Year Online"
	* [x] "Decommissioning Day"
	* [x] "Decommissioning Month"
	* [] "Decommissioning Year"
	* [] "Owner 1..N" and "Owner Stake 1..N"
	* [] "Plant Fuel 1..N"
	* [] "Project Fuel 1..N"
	* [] "Plant/Project Capacity" and "Plant/Project Capacity Unit": in MW
	* [] "Plant/Project Output": in MWh (= value in `GWh*1000`), 
		* [] "Plant Output", "Plant Output Unit", "Plant Output Year"
		* [] "Project Output", "Project Output Unit", "Project Output Year"
	* [] "Plant/Project CO2 Emissions", "Plant/Project CO2 Emissions Unit"
	* [] "Grid Connected"
	* [] "Manufacturer 1..N"
	* [] "SOx Reduction System", "NOx Reduction System"
	* [] "Total Cost", "Total Cost Currency"
	* [x] "Start Day/Month/Year"
	* [x] "Construction Start Day/Month/Year"
	* [x] "Completion Day/Month/Year"
	* [x] "New Construction"
	* [x] "Latitude", "Longitude"
	* [x] "Initiative"
	* [] "Contractor 1..N"
	* [x] "Consultant "
	* [x] "Implementing Agency"
	* [] "Operator 1..N"
	* [] "Funder 1..N", "Funding Amount 1..N", "Funding Currency 1..N"
	* [x] "Sources"
	* [x] "Notes"

* [] Merge data:
	* [] "Plant/Project Output": keep the value with the most recent "Plant/Project Output Year"
	* [] "Operator 1..M": collect all values 
	* [] "Status" based on rules in "Status Conversions" worksheet

* [] Combine:
	* [] "Technology Combination" indicates what other spreadsheet to combine with
		(Power Plant Name might not be an exact match)
	* [] Statuses: rules in the "Status Conversions" worksheet.
	* [] Owners: semicolon-separated list
