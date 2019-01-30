import { BaseProcessor, ProcessorResponse } from 'kyber-server';
import { CoordinateConversionRequestSchema, UTMSourceCoordinateSchema } from '../../schemas';
import { CoordinateConversionService, Utilities } from '../../common';

export class UTMNorthCoordsConverter extends BaseProcessor {

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
                coordinateConversionRequest.sourceCoordinates as Array<UTMSourceCoordinateSchema>;

                // Loop over and parse each coordinate substring.
                for ( let i = 0; i <= 3; i++ ) {
                   // grab first 15 byte chunk
                    const coordinate = nitfIGEOLO.substr(i*COORD_LENGTH, COORD_LENGTH);
                    // grab zone
                    const parsedZone = coordinate.substr(0,ZONE_LENGTH);
                    // grab easting
                    const parsedEasting = coordinate.substr(ZONE_LENGTH,EASTING_LENGTH);
                    // grab northing
                    const parsedNorthing = coordinate.substr(ZONE_LENGTH + EASTING_LENGTH, NORTHING_LENGTH);
                    // Add to sourceCoordinates array.
                    coordinateConversionRequest.sourceCoordinates.push({
                        sourceEasting: parsedEasting,
                        sourceNorthing: parsedNorthing,
                        sourceHemisphere: '',
                        sourceZoneData: parsedZone
                    });
                }

                // To be UTM 'N' ICORDS type, at least one of the coordinates must be in the northern hemisphere, we need to find it.
                // Find the nmin for hemisphere calculations.
                let nmin = coordinateConversionRequest.sourceCoordinates[0].sourceNorthing;
                for ( let i = 1; i <= 3; i++ )
                {
                    if ( coordinateConversionRequest.sourceCoordinates[i].sourceNorthing < nmin)
                    {
                        nmin = coordinateConversionRequest.sourceCoordinates[i].sourceNorthing;
                    }
                }

                // Determine if any northing value is greater than [nmin + 5000000].  (This would put it in the Southern Hemisphere, and the sourceHemisphere will need to be S, not N)
                for ( let i = 0; i <= 3; i++ )
                {
                    if ( coordinateConversionRequest.sourceCoordinates[i].sourceNorthing > (5000000 + nmin) )
                    {
                        coordinateConversionRequest.sourceCoordinates[i].sourceHemisphere = 'S';
                    }
                    else
                    {
                        coordinateConversionRequest.sourceCoordinates[i].sourceHemisphere = 'N';
                    }
                }

                const coordinateConversionService = new CoordinateConversionService(this.executionContext.correlationId);
                const body = await coordinateConversionService.get(coordinateConversionRequest);

                if (body && body.Coordinates) {
                    this.executionContext.raw.geoJson = Utilities.toGeoJSON(body.Coordinates);
                    this.executionContext.raw.wkt = Utilities.toWkt(body.Coordinates);
                    this.executionContext.raw.coordType = 'SN';
                    console.log(`\nUTMNORTHCONVERTER WROTE RAW ${JSON.stringify(this.executionContext.raw.wkt, null, 1)}\n\n`);
                }

                //this.executionContext.raw.converter = 'UTM North Cords';
                return resolve({
                    successful: true,
                });
            } catch (err) {
                console.error(`UTMNorthCordsConverter: ${err}`);
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
