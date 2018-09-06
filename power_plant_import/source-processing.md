# Power Plant Data Processing

Each column belongs either to a plant or a project.

* [x] Power Plant identity (primary key): power plants with the same 
	* [x] "Power Plant Name", 
	* [x] "Plant ID", or 
	* [x] "Latitude"+"Longitude"
* [x] GlobalData takes precedence over AllPowerPlants (ENI and WRI).

* [x] Normalize fields: 
	* [x] based on "Source - Variables Matrix" worksheet
	* [x] "Convert" column in "Tasks & Notes" worksheet

* [x] Filter out records:
	* [x] "Completion Year" < 2006
	* [x] "Decommissioning Year" < 2006
	* [x] "Country" is not in the "Country-Region Lookup" worksheet.
	* [x] ENI/WRI where power plant is not in the GlobalData
	* [x] "Plant Capacity" < 100 MW

* [] Filter out data:
	* [x] italicized values in (keys per output, not source):
		* [x] "Plant Day Online"
		* [x] "Plant Month Online"
		* [x] "Plant Year Online"
		* [x] "Total Cost"
	* [o] other italicized values? IGNORE
		* [o] "Capex USD", "CAPEX (USD)"?
		* [o] "Decommissioning Year", "Planned Decommissioning Year" (GD Thermal)?
		* [o] "Year Online"
		* [o] "Completion Year"
		* [o] "Commercial Year"
	* [] estimated data (not null) (don't want estimated data)
		* [] "Estimated Plant Output" if "Plant Output" is not null
		* [] "Estimated Plant Output Unit" if "Plant Output" is not null
		* [] "Estimated Project Output" if "Project Output" is not null
		* [] "Estimated Project Output Unit" if "Project Output" is not null

* [x] Merge data:
	* [x] "Plant/Project Output": keep the value with the most recent "Plant/Project Output Year"
	* [x] "Status" based on rules in "Status Conversions" worksheet
	* [x] merge and remove duplicates in:
		* [x] Contractor 1..N
		* [x] Manufacturer 1..N
		* [x] Operator 1..N
		* [x] Plant Fuel 1..N
		* [x] Owner 1..N: semicolon-separated list

* [x] Combine:
	* [o] "Technology Combination" indicates what other spreadsheet to combine with
		(Power Plant Name might not be an exact match)
	* [x] Statuses: rules in the "Status Conversions" worksheet.
