import { BaseProcessor, ProcessorResponse } from 'kyber-server';
import { CoordinateConversionRequestSchema } from '../../schemas';
import { CoordinateConversionService, Utilities } from '../../common';

export class GeographicCoordsConverter extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                // # Gather the IGEOLO string
                const nitfIGEOLO = this.executionContext.getParameterValue('IGEOLO');
                if (!nitfIGEOLO || nitfIGEOLO.length !== 60) {
                    console.error(`Invalid IGEOLO: ${nitfIGEOLO}`);
                    return reject({
                        message: `Invalid IGEOLO: ${nitfIGEOLO}`,
                        successful: false,
                    });
                }

                // # Put it into format for loading into object.
                
                // There are four 15 character coordinate strings in IGEOLO
                // First 7 bytes make up Latitude portion (DDMMSS[N|S])
                // Last 8 bytes make up Longitude portion (DDDMMSS[E|W])
                // Input to coordinate conversion service needs space separator (DD MM SS[N|S]) (DDD MM SS[N|S])
                const LAT_LENGTH: number = 7
                const LON_LENGTH: number = 8
                const COORD_LENGTH: number  = 15

                // Initialize new coordinate conversion request structure to UTM G type.
                const coordinateConversionRequest = new CoordinateConversionRequestSchema();
                coordinateConversionRequest.sourceCoordinateType = 10;

                for ( let i = 0; i <= 3; i++ )
                {   // grab first 15 byte chunk
                    const coordinate = nitfIGEOLO.substr(i*COORD_LENGTH, COORD_LENGTH);
                    // grab raw lat
                    const rawSubLat = coordinate.substr(0, LAT_LENGTH);
                    // grab raw long
                    const rawSubLon = coordinate.substr(LAT_LENGTH, LON_LENGTH);

                    // format lat
                    const formattedLat = rawSubLat.substr(0,2) + ' ' + rawSubLat.substr(2,2) + ' ' + rawSubLat.substr(4,3);
                    // split long
                    const formattedLon = rawSubLon.substr(0,3) + ' ' + rawSubLon.substr(3,2) + ' ' + rawSubLon.substr(5,3);
                    // Add to sourceCoordinates array.
                    coordinateConversionRequest.sourceCoordinates.push({
                        sourceLongitude: formattedLon,
                        sourceLatitude: formattedLat,
                        sourceHeight: '0'
                    });
                }

                const coordinateConversionService = new CoordinateConversionService(this.executionContext.correlationId);
                const body = await coordinateConversionService.get(coordinateConversionRequest);

                if (body && body.Coordinates) {
                    this.executionContext.raw.geoJson = Utilities.toGeoJSON(body.Coordinates);
                    this.executionContext.raw.wkt = Utilities.toWkt(body.Coordinates);
                    this.executionContext.raw.coordType = 'G';
                    console.log(`\nGEOGRAPHICCONVERTER WROTE RAW ${JSON.stringify(this.executionContext.raw.wkt, null, 1)}\n\n`);
                }

                // this.executionContext.raw.converter = 'Geographic Degrees';
                return resolve({
                    successful: true,
                });
            } catch (err) {
                console.error(`GeographicCoordsConverter: ${err}`);
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
