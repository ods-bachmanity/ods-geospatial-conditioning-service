"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
const schemas_1 = require("../../schemas");
const common_1 = require("../../common");
class GeographicCoordsConverter extends kyber_server_1.BaseProcessor {
    constructor() {
        super(...arguments);
        this.className = 'GoegraphicCoordsConverter';
    }
    fx(args) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let errString = '';
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
                const LAT_LENGTH = 7;
                const LON_LENGTH = 8;
                const COORD_LENGTH = 15;
                const coordinateConversionRequest = new schemas_1.CoordinateConversionRequestSchema();
                coordinateConversionRequest.sourceCoordinateType = 10;
                for (let i = 0; i <= 3; i++) {
                    const coordinate = nitfIGEOLO.substr(i * COORD_LENGTH, COORD_LENGTH);
                    const rawSubLat = coordinate.substr(0, LAT_LENGTH);
                    const rawSubLon = coordinate.substr(LAT_LENGTH, LON_LENGTH);
                    const formattedLat = rawSubLat.substr(0, 2) + ' ' + rawSubLat.substr(2, 2) + ' ' + rawSubLat.substr(4, 3);
                    const formattedLon = rawSubLon.substr(0, 3) + ' ' + rawSubLon.substr(3, 2) + ' ' + rawSubLon.substr(5, 3);
                    coordinateConversionRequest.sourceCoordinates.push({
                        sourceLongitude: formattedLon,
                        sourceLatitude: formattedLat,
                        sourceHeight: '0'
                    });
                }
                const coordinateConversionService = new common_1.CoordinateConversionService(this.executionContext.correlationId);
                const body = yield coordinateConversionService.get(coordinateConversionRequest);
                if (body && body.Coordinates) {
                    this.executionContext.raw.geoJson = common_1.Utilities.toGeoJSON(body.Coordinates);
                    this.executionContext.raw.wkt = common_1.Utilities.toWkt(body.Coordinates);
                    this.executionContext.raw.coordType = 'G';
                    if (!this.executionContext.raw.ods) {
                        this.executionContext.raw.ods = {};
                    }
                    if (!this.executionContext.raw.ods.processors) {
                        this.executionContext.raw.ods.processors = [];
                    }
                    if (body.ODS && body.ODS.Processors) {
                        this.executionContext.raw.ods.processors.push(body.ODS.Processors);
                    }
                    console.log(`\n${this.className} WROTE RAW ${JSON.stringify(this.executionContext.raw.wkt, null, 1)}\n\n`);
                    errString = '';
                    if (!(this.executionContext.raw.wkt) || !((this.executionContext.raw.wkt).length > 0)) {
                        errString += `\nFormatted wkt is empty in processor ${this.className}`;
                    }
                    if (!(this.executionContext.raw.geoJson) || !((this.executionContext.raw.geoJson.coordinates).length > 0)) {
                        errString += `\nFormatted geoJson is empty in processor ${this.className}`;
                    }
                    if (errString.length > 0) {
                        console.error(errString);
                        return reject({
                            httpStatus: 400,
                            message: `${errString}`,
                            successful: false,
                        });
                    }
                    else {
                        console.log(`\n${this.className} WROTE RAW ${JSON.stringify(this.executionContext.raw.wkt, null, 1)}\n\n`);
                    }
                }
                else {
                    errString = `Missing return from Coordinate Conversion Service in ${this.className}`;
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
            }
            catch (err) {
                console.error(`${this.className}: ${err}`);
                return reject({
                    httpStatus: 500,
                    message: `${err}`,
                    successful: false,
                });
            }
        }));
        return result;
    }
}
exports.GeographicCoordsConverter = GeographicCoordsConverter;
