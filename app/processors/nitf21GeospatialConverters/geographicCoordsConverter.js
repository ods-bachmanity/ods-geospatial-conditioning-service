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
const syber_server_1 = require("syber-server");
const schemas_1 = require("../../schemas");
const common_1 = require("../../common");
const nitf21ConverterHelper_1 = require("./nitf21ConverterHelper");
class GeographicCoordsConverter extends syber_server_1.BaseProcessor {
    constructor() {
        super(...arguments);
        this.className = 'GeographicCoordsConverter';
    }
    fx() {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let errString = '';
                const nitfIGEOLO = this.executionContext.getParameterValue('IGEOLO');
                if (!nitfIGEOLO || nitfIGEOLO.length !== 60) {
                    errString = `${this.className} - Invalid IGEOLO: ${nitfIGEOLO}`;
                    return reject(this.handleError({ message: errString }, `${this.className}.fx`, 400));
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
                        sourceHeight: '0',
                    });
                }
                const coordinateConversionService = new common_1.CoordinateConversionService(this.executionContext.correlationId, this.logger);
                const body = yield coordinateConversionService.get(coordinateConversionRequest);
                if (body && body.Coordinates) {
                    const nitf21Helper = new nitf21ConverterHelper_1.Nitf21ConverterHelper(this.executionContext, this.processorDef, this.logger);
                    nitf21Helper.populateCoordResults(body.Coordinates, 'G');
                    if (body.ODS && body.ODS.Processors) {
                        nitf21Helper.populateProcResults(body.ODS.Processors);
                    }
                    const validationResult = nitf21Helper.getValidationResult(this.className);
                    if (validationResult.errors) {
                        return reject(this.handleError({ message: validationResult.errString }, `${this.className}.fx`, 400));
                    }
                }
                else {
                    errString = `Missing return from Coordinate Conversion Service in ${this.className}`;
                    return reject(this.handleError({ message: errString }, `${this.className}`, 400));
                }
                this.executionContext.document.converter = `${this.className}`;
                return resolve({
                    successful: true,
                });
            }
            catch (err) {
                return reject(this.handleError(err, `${this.className}.fx`, 500));
            }
        }));
        return result;
    }
}
exports.GeographicCoordsConverter = GeographicCoordsConverter;
