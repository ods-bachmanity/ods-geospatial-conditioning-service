# ODS GEOSPATIAL CONDITIONING SERVICE

## Getting Started

Install libraries for the service from project root

`npm install`

To run development version, from root: `npm start`. This will start the application using `nodemon` which will hot reload the application anytime any file is changed.

### Using PM2 to run the application (Optional)

Install `PM2` on your local workstation

`npm install pm2 -g`

`pm2 install typescript`

This will run the application using PM2 on your local workstation. For more information on pm2, visit https://pm2.io/doc/en/runtime/overview/
- `pm2 start index.ts --watch` runs the application using PM2 AND watches for file changes
- `pm2 start index.ts` without the watch flag will not track any changes. You must `stop` or `restart` to see changes.
- `pm2 ps` or `pm2 ls` lists all running PM2 processes
- `pm2 stop id` stops the running process
- `pm2 start filepath` starts the process and can be either a TypeScript or JavaScript file in Node

## Usage

### Paths

#### HEALTH CHECK
GET `/v2/ods/geospatialconditioning/health` returns the Health Check

#### NITF 2.1
POST `/v2/ods/geospatialconditioning/nitf21` with a proper Request body returns EMC update document

##### Values for NITF21 Request Body
| Field   | Value |
|----------|------------------------|
| `ICOORDS` | one of D, G, U, N or S |
| `IGEOLO` | a properly formatted `IGEOLO` string from NITF2.1 metadata |

##### Response Document Format
````{TO: DO}````

## Notes
Output in the `./app` directory is used for deployment only. Developers should avoid making changes to that directory until they are ready to rev a new version. To do so, simply execute `tsc` on the project root to transpile the TypeScript code into relative JavaScript files. Don't forget to rev the version in both `package.json` files (project root + app directory).

