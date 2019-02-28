import { BaseProcessor, ProcessorResponse } from 'kyber-server';
import { Utilities } from '../../common';
import { DecimalDegreeCoordinateSchema } from '../../schemas';

export class DecimalDegreeConverter extends BaseProcessor {

    public className: string = 'DecimalDegreeConverter';

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
                        return reject({
                            httpStatus: 400,
                            message: `Invalid Latitude Coordinate: ${rawSubLat}`,
                            successful: false,
                        });
                    }

                    // format lon
                    let formattedLon = '';
                    if (rawSubLon[0] === '+') {
                        // Strip off the leading + symbol.
                        formattedLon = rawSubLon.substr(1, LON_LENGTH - 1);
                    } else if (rawSubLon[0] === '-') {
                        formattedLon = rawSubLon.substr(0, LON_LENGTH);
                    } else {
                        return reject({
                            httpStatus: 400,
                            message: `Invalid Longitude Coordinate: ${rawSubLon}`,
                            successful: false,
                        });
                    }

                    // Add to arrCoor array.
                    arrCoords.push({
                        Height: '0',
                        Latitude: formattedLat,
                        Longitude: formattedLon,
                    });
                }

                if (arrCoords.length > 0) {
                    this.executionContext.raw.geoJson = Utilities.toGeoJSON(arrCoords);
                    this.executionContext.raw.wkt = Utilities.toWkt(arrCoords);
                    this.executionContext.raw.coordType = 'D';
                }

                // Check if formatting to geoJson and wkt was successful.
                errString = '';
                if (!(this.executionContext.raw.wkt) || !((this.executionContext.raw.wkt).length > 0)) {
                    errString += `\nFormatted wkt is empty in processor ${this.className}`;
                }
                if (!(this.executionContext.raw.geoJson) || !((this.executionContext.raw.geoJson.coordinates).length > 0)) {
                    errString += `\nFormatted geoJson is empty in processor ${this.className}`;
                }

                // Report failure or log formatted wkt string.
                if (errString.length > 0) {
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
