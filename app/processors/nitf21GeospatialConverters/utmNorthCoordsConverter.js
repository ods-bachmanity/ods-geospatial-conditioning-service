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
    fx(args) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const nitfIGEOLO = this.executionContext.getParameterValue('IGEOLO');
                if (!nitfIGEOLO || nitfIGEOLO.length !== 60) {
                    console.error(`Invalid IGEOLO: ${nitfIGEOLO}`);
                    return reject({
                        message: `Invalid IGEOLO: ${nitfIGEOLO}`,
                        successful: false,
                    });
                }
                const ZONE_LENGTH = 2;
                const EASTING_LENGTH = 6;
                const NORTHING_LENGTH = 7;
                const COORD_LENGTH = 15;
                const coordinateConversionRequest = new schemas_1.CoordinateConversionRequestSchema();
                coordinateConversionRequest.sourceCoordinateType = 34;
                coordinateConversionRequest.sourceCoordinates;
                for (let i = 0; i <= 3; i++) {
                    const coordinate = nitfIGEOLO.substr(i * COORD_LENGTH, COORD_LENGTH);
                    const parsedZone = coordinate.substr(0, ZONE_LENGTH);
                    const parsedEasting = coordinate.substr(ZONE_LENGTH, EASTING_LENGTH);
                    const parsedNorthing = coordinate.substr(ZONE_LENGTH + EASTING_LENGTH, NORTHING_LENGTH);
                    coordinateConversionRequest.sourceCoordinates.push({
                        sourceEasting: parsedEasting,
                        sourceNorthing: parsedNorthing,
                        sourceHemisphere: '',
                        sourceZoneData: parsedZone
                    });
                }
                let nmin = coordinateConversionRequest.sourceCoordinates[0].sourceNorthing;
                for (let i = 1; i <= 3; i++) {
                    if (coordinateConversionRequest.sourceCoordinates[i].sourceNorthing < nmin) {
                        nmin = coordinateConversionRequest.sourceCoordinates[i].sourceNorthing;
                    }
                }
                for (let i = 0; i <= 3; i++) {
                    if (coordinateConversionRequest.sourceCoordinates[i].sourceNorthing > (5000000 + nmin)) {
                        coordinateConversionRequest.sourceCoordinates[i].sourceHemisphere = 'S';
                    }
                    else {
                        coordinateConversionRequest.sourceCoordinates[i].sourceHemisphere = 'N';
                    }
                }
                const coordinateConversionService = new common_1.CoordinateConversionService(this.executionContext.correlationId);
                const body = yield coordinateConversionService.get(coordinateConversionRequest);
                if (body && body.Coordinates) {
                    this.executionContext.raw.geoJson = common_1.Utilities.toGeoJSON(body.Coordinates);
                    this.executionContext.raw.wkt = common_1.Utilities.toWkt(body.Coordinates);
                    this.executionContext.raw.coordType = 'SN';
                    console.log(`\nUTMNORTHCONVERTER WROTE RAW ${JSON.stringify(this.executionContext.raw.wkt, null, 1)}\n\n`);
                }
                return resolve({
                    successful: true,
                });
            }
            catch (err) {
                console.error(`UTMNorthCordsConverter: ${err}`);
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
