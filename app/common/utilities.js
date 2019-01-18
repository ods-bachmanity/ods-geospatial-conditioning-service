"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utilities {
    static toGeoJSON(input) {
        if (!input || input.length <= 0) {
            return {};
        }
        const result = [];
        input.forEach((inputItem) => {
            const point = [];
            point.push(+inputItem.Longitude);
            point.push(+inputItem.Latitude);
            point.push(+inputItem.Height);
            result.push(point);
        });
        const testItem = input[0];
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
    static toWkt(input) {
        if (!input || input.length <= 0) {
            return '';
        }
        let output = 'POLYGON ((';
        input.forEach((inputItem) => {
            if (output.length > 10) {
                output += ',';
            }
            output += `${inputItem.Longitude} ${inputItem.Latitude}`;
        });
        if (input.length < 5) {
            output += `,${input[0].Longitude} ${input[0].Latitude}`;
        }
        output += '))';
        return output;
    }
}
exports.Utilities = Utilities;
