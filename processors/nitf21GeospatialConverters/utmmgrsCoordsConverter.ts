import { BaseProcessor, ProcessorResponse, ProcessorErrorResponse } from 'syber-server';
import { CoordinateConversionRequestSchema } from '../../schemas';
import { CoordinateConversionService, Utilities } from '../../common';
import { Nitf21ConverterHelper } from './nitf21ConverterHelper';

export class UTMMGRSCoordsConverter extends BaseProcessor {

    public className: string = 'UTMMGRSCoordsConverter';

    public fx(): Promise<ProcessorResponse|ProcessorErrorResponse> {

        const result: Promise<ProcessorResponse|ProcessorErrorResponse> = new Promise(async (resolve, reject) => {

            try {
                let errString: string = '';

                // # Gather the IGEOLO string
                const nitfIGEOLO = this.executionContext.getParameterValue('IGEOLO');
                if (!nitfIGEOLO || nitfIGEOLO.length !== 60) {
                    errString = `${this.className} - Invalid IGEOLO: ${nitfIGEOLO}`;
                    return reject(this.handleError({message: errString}, `${this.className}.fx`, 400));
                }

                // # IGEOLO string it into format for loading into object.

                // For ICORDS UTM-MGRS, there are four 15 character coordinate strings in IGEOLO (zzBJKeeeeennnnn)
                // The coordinate conversion service can take that full 15 character coordinate string as an input parameter.
                const COORD_LENGTH: number  = 15;

                const coordinateConversionRequest = new CoordinateConversionRequestSchema();
                coordinateConversionRequest.sourceCoordinateType = 19;

                for (let i = 0; i <= 3; i++) {   // grab first 15 byte chunk
                    const coordinate = nitfIGEOLO.substr(i * COORD_LENGTH, COORD_LENGTH);
                    // Add to sourceCoordinates array.
                    coordinateConversionRequest.sourceCoordinates.push({
                        sourceCoordinateString: coordinate,
                    });
                }

                // Make call to Coordinate Conversion service to get results back in WGS84 Decimal Degrees
                const coordinateConversionService = new CoordinateConversionService(this.executionContext.correlationId, this.logger);
                const body = await coordinateConversionService.get(coordinateConversionRequest);

                if (body && body.Coordinates) {

                    const nitf21Helper = new Nitf21ConverterHelper(this.executionContext, this.processorDef, this.logger);

                    // Pass the decimal degree coordinates to be converted and stored into geoJson, mbr and wkt formats.
                    nitf21Helper.populateCoordResults(body.Coordinates, 'U');

                    // Grab ODS.Processor return section from CoordinateConversionService
                    if (body.ODS && body.ODS.Processors) {
                        nitf21Helper.populateProcResults(body.ODS.Processors);
                    }

                    // Check if formatting to geoJson, mbr, and wkt was successful.
                    const validationResult = nitf21Helper.getValidationResult(this.className);

                    // Report failure or log formatted wkt string.
                    if (validationResult.errors) {
                        return reject(this.handleError({message: validationResult.errString}, `${this.className}.fx`, 400));
                    }
                } else {
                    errString = `Missing return from Coordinate Conversion Service in ${this.className}`;
                    return reject(this.handleError({message: errString}, `${this.className}.fx`, 400));
                }

                this.executionContext.document.converter = `${this.className}`;
                return resolve({
                    successful: true,
                });
            } catch (err) {
                return reject(this.handleError(err, `${this.className}.fx`, 500));
            }
        });

        return result;
    }
}
