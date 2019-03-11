import { BaseProcessor, ProcessorResponse } from 'kyber-server';
import { CoordinateConversionRequestSchema } from '../../schemas';
import { CoordinateConversionService, Utilities } from '../../common';

export class GeographicCoordsConverter extends BaseProcessor {

    public className: string = 'GoegraphicCoordsConverter';

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                let errString: string = '';

                // # Gather the IGEOLO string
                const nitfIGEOLO = this.executionContext.getParameterValue('IGEOLO');
                if (!nitfIGEOLO || nitfIGEOLO.length !== 60) {
                    errString = `${this.className} - Invalid IGEOLO: ${nitfIGEOLO}`;
                    console.error(errString);
                    return reject({
                        httpStatus: 400,
                        message: `${errString}`,
                        successful: false,
                    });
                }

                // # Put IGEOLO string into format for loading into object.

                // There are four 15 character coordinate strings in IGEOLO
                // First 7 bytes make up Latitude portion (DDMMSS[N|S])
                // Last 8 bytes make up Longitude portion (DDDMMSS[E|W])
                // Input to coordinate conversion service needs space separator (DD MM SS[N|S]) (DDD MM SS[N|S])
                const LAT_LENGTH: number = 7;
                const LON_LENGTH: number = 8;
                const COORD_LENGTH: number  = 15;

                // Initialize new coordinate conversion request structure to UTM G type.
                const coordinateConversionRequest = new CoordinateConversionRequestSchema();
                coordinateConversionRequest.sourceCoordinateType = 10;

                for ( let i = 0; i <= 3; i++ ) {
                    // grab first 15 byte chunk
                    const coordinate = nitfIGEOLO.substr(i * COORD_LENGTH, COORD_LENGTH);
                    // grab raw lat
                    const rawSubLat = coordinate.substr(0, LAT_LENGTH);
                    // grab raw long
                    const rawSubLon = coordinate.substr(LAT_LENGTH, LON_LENGTH);

                    // format lat
                    const formattedLat = rawSubLat.substr(0, 2) + ' ' + rawSubLat.substr(2, 2) + ' ' + rawSubLat.substr(4, 3);
                    // split long
                    const formattedLon = rawSubLon.substr(0, 3) + ' ' + rawSubLon.substr(3, 2) + ' ' + rawSubLon.substr(5, 3);
                    // Add to sourceCoordinates array.
                    coordinateConversionRequest.sourceCoordinates.push({
                        sourceLongitude: formattedLon,
                        sourceLatitude: formattedLat,
                        sourceHeight: '0',
                    });
                }

                const coordinateConversionService = new CoordinateConversionService(this.executionContext.correlationId);
                const body = await coordinateConversionService.get(coordinateConversionRequest);

                if (body && body.Coordinates) {
                    this.executionContext.raw.geoJson = Utilities.toGeoJSON(body.Coordinates);
                    this.executionContext.raw.wkt = Utilities.toWkt(body.Coordinates);
                    this.executionContext.raw.mbr = Utilities.toMbr(body.Coordinates);
                    this.executionContext.raw.coordType = 'G';

                    // Grab ODS.Processor return section from CoordinateConversionService
                    if (!this.executionContext.raw.ods) { this.executionContext.raw.ods = {}; }
                    if (!this.executionContext.raw.ods.processors) { this.executionContext.raw.ods.processors  = []; }
                    if (body.ODS && body.ODS.Processors) { this.executionContext.raw.ods.processors.push(body.ODS.Processors); }

                    console.log(`\n${this.className} WROTE RAW ${JSON.stringify(this.executionContext.raw.wkt, null, 1)}\n\n`);

                    // Check if formatting to geoJson and wkt was successful.
                    errString = '';
                    if (!(this.executionContext.raw.wkt) || !((this.executionContext.raw.wkt).length > 0)) {
                        errString += `\nFormatted wkt is empty in processor ${this.className}`;
                    }
                    if (!(this.executionContext.raw.geoJson) || !((this.executionContext.raw.geoJson.coordinates).length > 0)) {
                        errString += `\nFormatted geoJson is empty in processor ${this.className}`;
                    }
                    if (!(this.executionContext.raw.mbr) || !((this.executionContext.raw.mbr).length > 0)) {
                        errString += `\nFormatted mbr is empty in processor ${this.className}`;
                    }

                    // Report failure or log formatted wkt string.
                    if (errString.length > 0) {
                        console.error(errString);
                        return reject({
                            httpStatus: 400,
                            message: `${errString}`,
                            successful: false,
                        });
                    } else {
                        console.log(`\n${this.className} WROTE RAW ${JSON.stringify(this.executionContext.raw.wkt, null, 1)}\n\n`);
                    }
                } else {
                    errString = `Missing return from Coordinate Conversion Service in ${this.className}`;
                    console.error(errString);
                    return reject({
                        httpStatus: 400,
                        message: `${errString}`,
                        successful: false,
                    });
                }

                this.executionContext.raw.converter = `${this.className}`;
                return resolve({
                    successful: true,
                });
            } catch (err) {
                console.error(`${this.className}: ${err}`);
                return reject({
                    httpStatus: 500,
                    message: `${err}`,
                    successful: false,
                });
            }
        });

        return result;

    }
}
