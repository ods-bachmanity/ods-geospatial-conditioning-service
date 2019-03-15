import { BaseProcessor, ProcessorResponse } from 'kyber-server';
import { CoordinateConversionRequestSchema } from '../../schemas';
import { CoordinateConversionService, Utilities } from '../../common';

export class UTMSouthCoordsConverter extends BaseProcessor {

    public className: string = 'UTMSouthCoordConverter';

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

                // There are four 15 character coordinate strings in IGEOLO (zzeeeeeennnnnnn)
                // The first 2 bytes make up Zone portion (zz)
                // The next 6 bytes make up the easting portion (eeeeee)
                // The last 7 bytes make up Longitude portion (nnnnnnn)
                const ZONE_LENGTH: number = 2;
                const EASTING_LENGTH: number = 6;
                const NORTHING_LENGTH: number = 7;
                const COORD_LENGTH: number  = 15;

                // Initialize new coordinate conversion request structure to UTM S type.
                const coordinateConversionRequest = new CoordinateConversionRequestSchema();
                coordinateConversionRequest.sourceCoordinateType = 34;

                // Loop over and parse each coordinate substring.
                for ( let i = 0; i <= 3; i++ ) {
                    // grab first 15 byte chunk
                    const coordinate = nitfIGEOLO.substr(i * COORD_LENGTH, COORD_LENGTH);
                    // grab zone
                    const parsedZone = coordinate.substr(0, ZONE_LENGTH);
                    // grab easting
                    const parsedEasting = coordinate.substr(ZONE_LENGTH, EASTING_LENGTH);
                    // grab northing
                    const parsedNorthing = coordinate.substr(ZONE_LENGTH + EASTING_LENGTH, NORTHING_LENGTH);

                    // Add to sourceCoordinates array.
                    coordinateConversionRequest.sourceCoordinates.push({
                        sourceEasting: parsedEasting,
                        sourceNorthing: parsedNorthing,
                        sourceHemisphere: 'S',
                        sourceZoneData: parsedZone,
                    });
                }

                const coordinateConversionService = new CoordinateConversionService(this.executionContext.correlationId);
                const body = await coordinateConversionService.get(coordinateConversionRequest);

                if (body && body.Coordinates) {
                    this.executionContext.raw.geoJson = Utilities.toGeoJSON(body.Coordinates);
                    this.executionContext.raw.wkt = Utilities.toWkt(body.Coordinates);
                    this.executionContext.raw.mbr = Utilities.toMbr(body.Coordinates);
                    this.executionContext.raw.coordType = 'S';

                    // Grab ODS.Processor return section from CoordinateConversionService
                    this.executionContext.raw.ODS = this.executionContext.raw.ODS || {};
                    this.executionContext.raw.ODS.Processors = this.executionContext.raw.ODS.Processors || {};
                    this.executionContext.raw.ODS.Processors = Object.assign({}, this.executionContext.raw.ODS.Processors, body.ODS.Processors);

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
