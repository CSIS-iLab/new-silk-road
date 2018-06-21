# Power Plant Data Processing

Each column belongs either to a plant or a project.

* [x] Power Plant identity (primary key): power plants with the same 
	* [x] "Power Plant Name", 
	* [x] "Plant ID", or 
	* [x] "Latitude"+"Longitude"
* [x] GlobalData takes precedence over AllPowerPlants (ENI and WRI).
* [] Normalize fields: based on "Source - Variables Matrix" worksheet
	* [] "Power Plant Name"
	* [] "Project Name"
	* [] "Infrastructure Type"
	* [] "Country"
	* [] "Region" – based on Country-Region Lookup
	* [] "Plant Status"
	* [] "Plant Day/Month/Year Online"
	* [] "Decommissioning Day/Month/Year"
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
	* [] "Project Status"
	* [] "Total Cost", "Total Cost Currency"
	* [] "Start Day/Month/Year"
	* [] "Construction Start Day/Month/Year"
	* [] "Completion Day/Month/Year"
	* [] "New Construction"
	* [] "Latitude", "Longitude"
	* [] "Initiative"
	* [] "Contractor 1..N"
	* [] "Consultant "
	* [] "Implementing Agency"
	* [] "Operator 1..N"
	* [] "Funder 1..N", "Funding Amount 1..N", "Funding Currency 1..N"
	* [] "Sources"
	* [] "Notes"

* [] Filter out records:
	* [] the country is not in the "Country-Region Lookup" worksheet.
	* [] "Completion Year" < 2006
	* [] "Decommissioning Year" < 2006
	* [] estimated data (not null) (don't want estimated data)
		* [] "Estimated Plant Output" 
		* [] "Estimated Plant Output Unit"
		* [] "Estimated Project Output" 
		* [] "Estimated Project Output Unit"
	* [] "Plant Capacity" < 100 (or null I assume)
	* [] ENI/WRI where power plant is not in the GlobalData
* [] Filter out data:
	* [] italicized values in (keys per output, not source):
		* [] "Plant Day Online"
		* [] "Plant Month Online"
		* [] "Plant Year Online"
		* [] "Total Cost"
	* [] duplicates in:
		* [] Contractor 1..12
		* [] Manufacturer 1..5
		* [] Operator 1..2
		* [] Plant Fuel 1..4
* [] Merge data:
	* [] "Plant/Project Output": keep the value with the most recent "Plant/Project Output Year"
	* [] "Operator 1..M": collect all values 
	* [] "Status" based on rules in "Status Conversions" worksheet
* [] Combine:
	* [] "Technology Combination" indicates what other spreadsheet to combine with
		(Power Plant Name might not be an exact match)
	* [] Statuses: rules in the "Status Conversions" worksheet.
	* [] Owners: semicolon-separated list
