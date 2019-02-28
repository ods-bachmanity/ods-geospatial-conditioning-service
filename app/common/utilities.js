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
    static comparePoints(pointOne, pointTwo) {
        let pointsMatch = false;
        if (pointOne.Height === pointTwo.Height && pointOne.Latitude === pointTwo.Latitude && pointOne.Longitude === pointTwo.Longitude) {
            pointsMatch = true;
        }
        return pointsMatch;
    }
    static getOdsProcessorJSON(status, addLastUpdated) {
        const date = new Date();
        let timestamp = date.toISOString();
        timestamp = timestamp.replace('Z', '+00:00');
        const serviceName = process.env.npm_package_servicename ? process.env.npm_package_servicename : 'GCS default';
        const serviceVersion = process.env.npm_package_version ? process.env.npm_package_version : 'default version';
        const serviceLastUpdated = process.env.npm_package_lastupdated ? process.env.npm_package_lastupdated : '1970-01-01T00:00:00.000+00:00';
        const jsonReturn = {};
        jsonReturn[serviceName] = {
            status: `${status}`,
            timestamp: `${timestamp}`,
            version: `${serviceVersion}`,
        };
        if (addLastUpdated) {
            jsonReturn[serviceName].lastUpdated = serviceLastUpdated;
        }
        return jsonReturn;
    }
}
exports.Utilities = Utilities;
