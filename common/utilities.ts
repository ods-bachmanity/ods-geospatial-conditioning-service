import { DecimalDegreeCoordinateSchema } from '../schemas';

export class Utilities {

    public static toGeoJSON(input: Array<DecimalDegreeCoordinateSchema>): any {

        if (!input || input.length <= 0) {
            return {};
        }
        const result: Array<Array<number>> = [];
        input.forEach((inputItem: DecimalDegreeCoordinateSchema) => {
            const point = [];
            point.push(+inputItem.Longitude);
            point.push(+inputItem.Latitude);
            point.push(+inputItem.Height);
            result.push(point);
        });

        // Test if need to close shape
        // Check if shape is a polygon. (Greater than 2 points) Compare first point to last point.
        // If required, push first point onto the end of the array to close GeoJSON polygon.
        if (result.length > 2) {
            const testDDPointFirst: DecimalDegreeCoordinateSchema = input[0];
            const testDDPointLast: DecimalDegreeCoordinateSchema = input[input.length - 1];
            if (!this.comparePoints(testDDPointFirst, testDDPointLast)) {
                const point = [];
                point.push(+testDDPointFirst.Longitude);
                point.push(+testDDPointFirst.Latitude);
                point.push(+testDDPointFirst.Height);
                result.push(point);
            }
        }

        const wrapper = [];
        wrapper.push(result);

        return {
            coordinates: wrapper,
            type: 'Polygon',
        };
    }

    public static toWkt(input: Array<DecimalDegreeCoordinateSchema>): string {

        if (!input || input.length <= 0) {
            return '';
        }
        let output = 'POLYGON ((';
        input.forEach((inputItem: DecimalDegreeCoordinateSchema) => {
            if (output.length > 10) {
                output += ',';
            }
            output += `${inputItem.Longitude} ${inputItem.Latitude}`; // ${item.Height}`;
        });
        // Test if need to close shape (what if not 4 sides?)
        // Check if shape is a polygon. (Greater than 2 points) Compare first point to last point.
        // If required, push first point onto the end of the array to close GeoJSON polygon.
        if (input.length > 2) {
            const testDDPointFirst: DecimalDegreeCoordinateSchema = input[0];
            const testDDPointLast: DecimalDegreeCoordinateSchema = input[input.length - 1];
            if (!this.comparePoints(testDDPointFirst, testDDPointLast)) {
                output += `,${input[0].Longitude} ${input[0].Latitude}`; // ${input[0].Height}`;
            }
        }
        output += '))';
        return output;

    }

    public static toMbr(input: Array<DecimalDegreeCoordinateSchema>): string {

        if (!input || input.length <= 0) {
            return '';
        }

        // Initialize mins to maxes and maxes to mins.
        let minLon: string = '180.0';
        let maxLon: string = '-180.0';
        let minLat: string = '90.0';
        let maxLat: string = '-90.0';

        // Open MBR RECTANGLE string.
        let output = 'RECTANGLE (';

        // Determine min and max longitude and latitude.
        input.forEach((inputItem: DecimalDegreeCoordinateSchema) => {
            if (Number(inputItem.Longitude) < Number(minLon)) {
                minLon = inputItem.Longitude;
            }
            if (Number(inputItem.Longitude) > Number(maxLon)) {
                maxLon = inputItem.Longitude;
            }
            if (Number(inputItem.Latitude) < Number(minLat)) {
                minLat = inputItem.Latitude;
            }
            if (Number(inputItem.Latitude) > Number(maxLat)) {
                maxLat = inputItem.Latitude;
            }
        });

        // Fill in Rectangle values.  (Should be WGS84 Decimal Degree coordinate pairs for lower left and upper right of MBR [minLon minLat, maxLon maxLat])
        output += `${minLon} ${minLat},${maxLon} ${maxLat}`;

        // Close MBR Rectangle string.
        output += ')';
        return output;

    }

    public static comparePoints(pointOne: DecimalDegreeCoordinateSchema, pointTwo: DecimalDegreeCoordinateSchema): boolean {
        let pointsMatch: boolean = false;

        if (pointOne.Height === pointTwo.Height && pointOne.Latitude === pointTwo.Latitude && pointOne.Longitude === pointTwo.Longitude) {
            pointsMatch = true;
        }

        return pointsMatch;
    }

    public static getOdsProcessorJSON(status?: string): any {
        const packageJson = require('../package.json');
        const timestamp = new Date().toISOString().replace('Z', '+00:00');

        return {
            geospatialConditioner: {
                status: status || 'success',
                timestamp,
                version: packageJson.version || 'Unknown',
            },
        };
    }
}
