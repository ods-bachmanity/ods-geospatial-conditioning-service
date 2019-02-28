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
class UTMNorthCoordsConverter extends kyber_server_1.BaseProcessor {
    constructor() {
        super(...arguments);
        this.className = 'UTMNorthCoordsConverter';
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
                const ZONE_LENGTH = 2;
                const EASTING_LENGTH = 6;
                const NORTHING_LENGTH = 7;
                const COORD_LENGTH = 15;
                const coordinateConversionRequest = new schemas_1.CoordinateConversionRequestSchema();
                coordinateConversionRequest.sourceCoordinateType = 34;
                const coords = [];
                for (let i = 0; i <= 3; i++) {
                    const coordinate = nitfIGEOLO.substr(i * COORD_LENGTH, COORD_LENGTH);
                    const parsedZone = coordinate.substr(0, ZONE_LENGTH);
                    const parsedEasting = coordinate.substr(ZONE_LENGTH, EASTING_LENGTH);
                    const parsedNorthing = coordinate.substr(ZONE_LENGTH + EASTING_LENGTH, NORTHING_LENGTH);
                    const coord = {
                        sourceEasting: parsedEasting,
                        sourceNorthing: parsedNorthing,
                        sourceHemisphere: '',
                        sourceZoneData: parsedZone,
                    };
                    coords.push(coord);
                }
                let nmin = coords[0].sourceNorthing;
                for (let i = 1; i <= 3; i++) {
                    if (coords[i].sourceNorthing < nmin) {
                        nmin = coords[i].sourceNorthing;
                    }
                }
                for (let i = 0; i <= 3; i++) {
                    if (coords[i].sourceNorthing > (5000000 + nmin)) {
                        coords[i].sourceHemisphere = 'S';
                    }
                    else {
                        coords[i].sourceHemisphere = 'N';
                    }
                }
                coordinateConversionRequest.sourceCoordinates = coords;
                const coordinateConversionService = new common_1.CoordinateConversionService(this.executionContext.correlationId);
                const body = yield coordinateConversionService.get(coordinateConversionRequest);
                if (body && body.Coordinates) {
                    this.executionContext.raw.geoJson = common_1.Utilities.toGeoJSON(body.Coordinates);
                    this.executionContext.raw.wkt = common_1.Utilities.toWkt(body.Coordinates);
                    this.executionContext.raw.coordType = 'N';
                    if (!this.executionContext.raw.ods) {
                        this.executionContext.raw.ods = {};
                    }
                    if (!this.executionContext.raw.ods.processors) {
                        this.executionContext.raw.ods.processors = [];
                    }
                    if (body.ODS && body.ODS.Processors) {
                        this.executionContext.raw.ods.processors.push(body.ODS.Processors);
                    }
                    console.log(`\n${this.className} WROTE RAW ${JSON.stringify(this.executionContext.raw.ods, null, 1)}\n\n`);
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
exports.UTMNorthCoordsConverter = UTMNorthCoordsConverter;
