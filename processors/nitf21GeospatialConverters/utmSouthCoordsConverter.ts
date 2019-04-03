import { BaseProcessor, ProcessorResponse, ProcessorErrorResponse } from 'syber-server';
import { CoordinateConversionRequestSchema } from '../../schemas';
import { CoordinateConversionService, Utilities } from '../../common';
import { Nitf21ConverterHelper } from './nitf21ConverterHelper';

export class UTMSouthCoordsConverter extends BaseProcessor {

    public className: string = 'UTMSouthCoordConverter';

    public fx(): Promise<ProcessorResponse|ProcessorErrorResponse> {

        const result: Promise<ProcessorResponse|ProcessorErrorResponse> = new Promise(async (resolve, reject) => {

            try {
                let errString: string = '';

                // # Gather the IGEOLO string
                const nitfIGEOLO = this.executionContext.getParameterValue('IGEOLO');
                if (!nitfIGEOLO || nitfIGEOLO.length !== 60) {
                    errString = `${this.className} - Invalid IGEOLO: ${nitfIGEOLO}`;
                    return reject(this.handleError({message: errString}, `utmSouthCoordsConverter.fx`, 400));
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

                // Make call to Coordinate Conversion service to get results back in WGS84 Decimal Degrees
                const coordinateConversionService = new CoordinateConversionService(this.executionContext.correlationId, this.logger);
                const body = await coordinateConversionService.get(coordinateConversionRequest);

                if (body && body.Coordinates) {

                    const nitf21Helper = new Nitf21ConverterHelper(this.executionContext, this.processorDef, this.logger);

                    // Pass the decimal degree coordinates to be converted and stored into geoJson, mbr and wkt formats.
                    nitf21Helper.populateCoordResults(body.Coordinates, 'S');

                    // Grab ODS.Processor return section from CoordinateConversionService
                    if (body.ODS && body.ODS.Processors) {
                        nitf21Helper.populateProcResults(body.ODS.Processors);
                    }

                    // Check if formatting to geoJson, mbr, and wkt was successful.
                    const validationResult = nitf21Helper.getValidationResult(this.className);

                    // Report failure or log formatted wkt string.
                    if (validationResult.errors) {
                        return reject(this.handleError({message: validationResult.errString}, `utmSouthCoordsConverter.fx`, 400));
                    }
                } else {
                    errString = `Missing return from Coordinate Conversion Service in ${this.className}`;
                    return reject(this.handleError({message: errString}, `utmSouthCoordsConverter.fx`, 400));
                }

                this.executionContext.document.converter = `${this.className}`;
                return resolve({
                    successful: true,
                });
            } catch (err) {
                return reject(this.handleError(err, `utmSouthCoordsConverter.fx`, 500));
            }
        });

        return result;

    }
}
