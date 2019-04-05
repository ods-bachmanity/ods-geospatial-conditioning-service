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
        if (result.length > 2) {
            const testDDPointFirst = input[0];
            const testDDPointLast = input[input.length - 1];
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
        if (input.length > 2) {
            const testDDPointFirst = input[0];
            const testDDPointLast = input[input.length - 1];
            if (!this.comparePoints(testDDPointFirst, testDDPointLast)) {
                output += `,${input[0].Longitude} ${input[0].Latitude}`;
            }
        }
        output += '))';
        return output;
    }
    static toMbr(input) {
        if (!input || input.length <= 0) {
            return '';
        }
        let minLon = '180.0';
        let maxLon = '-180.0';
        let minLat = '90.0';
        let maxLat = '-90.0';
        let output = 'RECTANGLE (';
        input.forEach((inputItem) => {
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
        output += `${minLon} ${minLat},${maxLon} ${maxLat}`;
        output += ')';
        return output;
    }
    static comparePoints(pointOne, pointTwo) {
        return (pointOne.Height === pointTwo.Height && pointOne.Latitude === pointTwo.Latitude && pointOne.Longitude === pointTwo.Longitude);
    }
    static getOdsProcessorJSON(status) {
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
exports.Utilities = Utilities;
