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
const nitf21ConverterHelper_1 = require("./nitf21ConverterHelper");
class DecimalDegreeConverter extends syber_server_1.BaseProcessor {
    constructor() {
        super(...arguments);
        this.className = 'DecimalDegreeConverter';
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
                const arrCoords = [];
                for (let i = 0; i <= 3; i++) {
                    const coordinate = nitfIGEOLO.substr(i * COORD_LENGTH, COORD_LENGTH);
                    const rawSubLat = coordinate.substr(0, LAT_LENGTH);
                    const rawSubLon = coordinate.substr(LAT_LENGTH, LON_LENGTH);
                    let formattedLat = '';
                    if (rawSubLat[0] === '+') {
                        formattedLat = rawSubLat.substr(1, LAT_LENGTH - 1);
                    }
                    else if (rawSubLat[0] === '-') {
                        formattedLat = rawSubLat.substr(0, LAT_LENGTH);
                    }
                    else {
                        return reject(this.handleError({ message: `Invalid Latitude Coordinate: ${rawSubLat}` }, `${this.className}.fx`, 400));
                    }
                    let formattedLon = '';
                    if (rawSubLon[0] === '+') {
                        formattedLon = rawSubLon.substr(1, LON_LENGTH - 1);
                    }
                    else if (rawSubLon[0] === '-') {
                        formattedLon = rawSubLon.substr(0, LON_LENGTH);
                    }
                    else {
                        return reject(this.handleError({ message: `Invalid Longitude Coordinate: ${rawSubLon}` }, `${this.className}.fx`, 400));
                    }
                    arrCoords.push({
                        Height: '0',
                        Latitude: formattedLat,
                        Longitude: formattedLon,
                    });
                }
                if (arrCoords.length > 0) {
                    const nitf21Helper = new nitf21ConverterHelper_1.Nitf21ConverterHelper(this.executionContext, this.processorDef, this.logger);
                    nitf21Helper.populateCoordResults(arrCoords, 'D');
                    const validationResult = nitf21Helper.getValidationResult(this.className);
                    if (validationResult.errors) {
                        return reject(this.handleError({ message: validationResult.errString }, `${this.className}.fx`, 400));
                    }
                }
                else {
                    errString = `Failed to create coordinate array in ${this.className}`;
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
exports.DecimalDegreeConverter = DecimalDegreeConverter;
