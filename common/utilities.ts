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
        // TODO: Test if need to close shape
        // Push first point onto the end of the array to close GeoJSON polygon.
        const testItem: DecimalDegreeCoordinateSchema = input[0];
        if (result.length < 5) {
            const point = [];
            point.push(+testItem.Longitude);
            point.push(+testItem.Latitude);
            point.push(+testItem.Height);
            result.push(point);
        }

        const wrapper = [];
        wrapper.push(result);

        return {
            geometry: {
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
        // TODO: Test if need to close shape (what if not 4 sides?)
        if (input.length < 5) {
            output += `,${input[0].Longitude} ${input[0].Latitude}`; // ${input[0].Height}`;
        }
        output += '))';
        return output;

    }

}
