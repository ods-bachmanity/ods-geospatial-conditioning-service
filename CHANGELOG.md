## v2.1.3 (April 9, 2019)

* #36945 - Add HTTP Logging to GCS - Dependent on Research and document exactly what each service needs to log (Mike)
* #36945 - Without specific requirement, use Apache combined format and include correlation id and response time in milliseconds
* #36945 - Requires node to have read/write privileges on OS for path `/var/logs/gcs/http/http.log`

## v2.1.2 (April 2, 2019)

* #38215 - Restructuring/fix Node app pipeline (logging, pm2, swagger)
* #35736 - Implement Logging Architecture changes for Logging Conditioning Microservices

## v2.1.1 (March 29, 2019)

* #39629 - Refactored nitf 2.1 converters code to use common functions for collecting information return from Coordinate Conversion and populate return structures.

## v2.1.0 (March 25, 2019)

* #39840 - Updated GCS toMBR Rectangle return format to match provided example, added MBR to JSON return structure in README.md

## v2.0.13 (March 22, 2019)

* #33517 - Created Readme.MD for Geospatial Conditioning Service
* #38544 - Created app deployment bundle for new GCS service
* #35764 - Implemented HTTP Handshake between NiFi and GCS
* #37766 - Updated error handling code in NITF 2.1 processors in Geospatial Conditioning Service.
* #38554 - Updated Geospatial Conditioning Service health endpoint to check for dependent services health as well.
* #37765 - Added ODS conditioner processor information to return payload of Geospatial Conditioning Service.
* #33516 - Created integration tests for Geospatial Conditioning Service
* #38048 - Updated Geospatial Conditioning Service endpoint to return proper format of Countries
* #35333 - Created NITF 2.1 endpoint for GeoSpatial Service that takes in ICORDS and IGEOLO data fields
* #35593 - Created processor for Handling "G" NITF 2.1 ICORDS type
* #36010 - Created processor for Handling "D" NITF 2.1 ICORD type
* #35592 - Created processor for Handling "U" NITF 2.1 ICORDS type
* #35334 - Create processor for Handling "D" NITF 2.1 ICORD type
* #38201 - Created processor for translating footprint in DD format into MBR format.
* #35589 - Created processor for Handling "N" NITF 2.1 ICORDS type
* #35590 - Created processor for Handling "S" NITF 2.1 ICORDS type
* #33514 - Updated Geospatial Conditioning Service endpoint to accept all 5 coordinates and coordinate types possible for NITF 2.1 and return resulting GEO structure for insertion into catalog.
* #36001 - Created processor for translating footprint in DD format into GeoJSON format.
* #36002 - Created processor for translating footprint in DD format into WKT format.
* #35332 - Create Scaffold for new Geospatial Service following CCS example

