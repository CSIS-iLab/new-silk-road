# Power Plant Data Processing

Each column belongs either to a plant or a project.

* [x] Power Plant identity (primary key): power plants with the same 
	* [x] "Power Plant Name", 
	* [x] "Plant ID", or 
	* [x] "Latitude"+"Longitude"
* [x] GlobalData takes precedence over AllPowerPlants (ENI and WRI).

* [x] Normalize fields: based on "Source - Variables Matrix" worksheet

* [] Filter out records:
	* [x] "Completion Year" < 2006
	* [x] "Decommissioning Year" < 2006
	* [x] "Country" is not in the "Country-Region Lookup" worksheet.
	* [x] ENI/WRI where power plant is not in the GlobalData
	* [] "Plant Capacity" < 100 MW

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

* [] Merge data:
	* [] "Plant/Project Output": keep the value with the most recent "Plant/Project Output Year"
	* [] "Operator 1..M": collect all values 
	* [] "Status" based on rules in "Status Conversions" worksheet

* [] Combine:
	* [] "Technology Combination" indicates what other spreadsheet to combine with
		(Power Plant Name might not be an exact match)
	* [] Statuses: rules in the "Status Conversions" worksheet.
	* [] Owners: semicolon-separated list
