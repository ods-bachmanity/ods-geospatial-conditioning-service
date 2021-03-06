# ODS GEOSPATIAL CONDITIONING SERVICE

## Getting Started

Install libraries for the service from project root

`npm install`

Create your local environment variables by creating a local copy of `cfg.env` renamed to `.env`. The program will read the contents from `.env`, not from `cfg.env` since the latter is used just to store the key names in source code without any values.

`cp cfg.env .env`


To run development version, from root: `npm start`. This will start the application using `nodemon` which will hot reload the application anytime any file is changed.

`npm start`



## Usage

### Paths

#### HEALTH CHECK
GET `/v2/ods/geospatialconditioning/health` returns the Health Check

##### Response Document Format
``` JSON
{
    "countryCodeService": "[Reachable|Unreachable]",
    "coordinateConversionService": "[Reachable|Unreachable]",
    "ODS": {
        "Processors": {
            "geospatialConditioner": {
                "status": "<string>",
                "timestamp": "<string>",
                "version": "<string>",
            }
        }
    }
}
```

#### NITF 2.1
POST `/v2/ods/geospatialconditioning/nitf21` with a proper Request body returns EMC update document

##### Values for NITF21 Request Body
| Field   | Value |
|----------|------------------------|
| `fingerprint` | string representing the fingerprint of the NITF 2.1 source |
| `ICORDS` | one of D, G, U, N or S |
| `IGEOLO` | a properly formatted `IGEOLO` string from NITF2.1 metadata |

##### Response Document Format
``` JSON
{
    "GEO": {
        "WKT": "<string>",
        "GeoJSON": {
            "geometry": {
                "coordinates": [],
                "type": "Polygon"
            },
            "properties": {},
            "type": "Feature"
        },
        "MBR": "<string>",
        "Countries": ["ABC", "DEF"]
    },
    "ODS": {
        "Processors": {
            "geospatialConditioner": {
                "status": "<string>",
                "timestamp": "<string>",
                "version": "<string>",
            },
            "<processor_name_1>": {
                "status": "<string>",
                "timestamp": "<string>",
                "version": "<string>",
            },
            "<processor_name_n>": {
                "status": "<string>",
                "timestamp": "<string>",
                "version": "<string>",
            }
        }
    }
}
```

## Notes
Output in the `./app` directory is used for deployment only. Developers should avoid making changes to that directory until they are ready to rev a new version. To do so, simply execute `tsc` on the project root to transpile the TypeScript code into relative JavaScript files. Don't forget to rev the version in both `package.json` files (project root + app directory).

## TODO
- Will the App Dynamics Controller be upgraded? Should we write our own adapter to the 4.3 version REST api?
- syber-server execution context introduce .state to maintain state between activities and processes
- syber-server automatically generate swagger.json/swagger.yml
- syber-server introduce version and hash to schematics
- syber-server conditional activities e.g. if, ifelse, switchcase
- syber-server control structures in activities e.g. forEach, while, for
- audit `./app` creation
