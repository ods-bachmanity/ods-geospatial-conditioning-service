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
            location: {
                coordinates: wrapper,
                type: 'Polygon',
              },
              properties: {},
              type: 'Feature',
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

    public static comparePoints(pointOne: DecimalDegreeCoordinateSchema, pointTwo: DecimalDegreeCoordinateSchema): boolean {
        let pointsMatch: boolean = false;

        if (pointOne.Height === pointTwo.Height && pointOne.Latitude === pointTwo.Latitude && pointOne.Longitude === pointTwo.Longitude) {
            pointsMatch = true;
        }

        return pointsMatch;
    }

    public static getOdsProcessorJSON(status: string, addLastUpdated: boolean): any {
        const date = new Date();
        let timestamp = date.toISOString();
        timestamp = timestamp.replace('Z', '+00:00');

        // Grab the service name, version and last updated times from the environment (package.json), load defaults if unavailable.
        const serviceName: string = process.env.npm_package_servicename ? process.env.npm_package_servicename : 'GCS default';
        const serviceVersion: string = process.env.npm_package_version ? process.env.npm_package_version : 'default version';
        const serviceLastUpdated: string = process.env.npm_package_lastupdated ? process.env.npm_package_lastupdated : '1970-01-01T00:00:00.000+00:00';

        const jsonReturn = {};

        // Generate ODS.Processor inital return structure.
        jsonReturn[serviceName] = {
            status: `${status}`,
            timestamp: `${timestamp}`,
            version: `${serviceVersion}`,
        };

        // If requested, add last updated field to ODS.Processor.<servicename> return structure.
        if (addLastUpdated) {
            jsonReturn[serviceName].lastUpdated = serviceLastUpdated;
        }

        return jsonReturn;
    }
}
