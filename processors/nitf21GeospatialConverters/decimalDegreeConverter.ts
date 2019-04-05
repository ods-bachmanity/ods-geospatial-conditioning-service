import { BaseProcessor, ProcessorResponse, ProcessorErrorResponse, ExecutionContext, ProcessorDef } from 'syber-server';
import { Utilities } from '../../common';
import { DecimalDegreeCoordinateSchema } from '../../schemas';
import { Nitf21ConverterHelper } from './nitf21ConverterHelper';

export class DecimalDegreeConverter extends BaseProcessor {

    public className: string = 'DecimalDegreeConverter';

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

                // # Put IGEOLO string into format for loading into object.

                // There are four 15 character coordinate strings in IGEOLO
                // First 7 bytes make up Latitude portion (±dd.ddd)
                // Last 8 bytes make up Longitude portion (±ddd.ddd)
                // Break into pieces to create coordinate array for toGeoJSON and toWkt functions.
                const LAT_LENGTH: number = 7;
                const LON_LENGTH: number = 8;
                const COORD_LENGTH: number  = 15;

                const arrCoords: Array<DecimalDegreeCoordinateSchema> = [];

                for (let i = 0; i <= 3; i++) {   // grab first 15 byte chunk
                    const coordinate = nitfIGEOLO.substr(i * COORD_LENGTH, COORD_LENGTH);
                    // grab raw lat
                    const rawSubLat = coordinate.substr(0, LAT_LENGTH);
                    // grab raw long
                    const rawSubLon = coordinate.substr(LAT_LENGTH, LON_LENGTH);

                    // format lat
                    let formattedLat = '';
                    if (rawSubLat[0] === '+') {
                        // Strip off the leading + symbol.
                        formattedLat = rawSubLat.substr(1, LAT_LENGTH - 1);
                    } else if (rawSubLat[0] === '-') {
                        formattedLat = rawSubLat.substr(0, LAT_LENGTH);
                    } else {
                        return reject(this.handleError({message: `Invalid Latitude Coordinate: ${rawSubLat}`}, `${this.className}.fx`, 400));
                    }

                    // format lon
                    let formattedLon = '';
                    if (rawSubLon[0] === '+') {
                        // Strip off the leading + symbol.
                        formattedLon = rawSubLon.substr(1, LON_LENGTH - 1);
                    } else if (rawSubLon[0] === '-') {
                        formattedLon = rawSubLon.substr(0, LON_LENGTH);
                    } else {
                        return reject(this.handleError({message: `Invalid Longitude Coordinate: ${rawSubLon}`}, `${this.className}.fx`, 400));
                    }

                    // Add to arrCoor array.
                    arrCoords.push({
                        Height: '0',
                        Latitude: formattedLat,
                        Longitude: formattedLon,
                    });
                }

                if (arrCoords.length > 0) {
                    const nitf21Helper = new Nitf21ConverterHelper(this.executionContext, this.processorDef, this.logger);

                    // Pass the decimal degree coordinates to be converted and stored into geoJson, mbr, and wkt formats.
                    nitf21Helper.populateCoordResults(arrCoords, 'D');

                    // Check if formatting to geoJson, mbr, and wkt was successful.
                    const validationResult = nitf21Helper.getValidationResult(this.className);

                    // Report failure or log formatted wkt string.
                    if (validationResult.errors) {
                        return reject(this.handleError({message: validationResult.errString}, `${this.className}.fx`, 400));
                    }
                } else {
                    errString = `Failed to create coordinate array in ${this.className}`;
                    return reject(this.handleError({message: errString}, `${this.className}`, 400));
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
