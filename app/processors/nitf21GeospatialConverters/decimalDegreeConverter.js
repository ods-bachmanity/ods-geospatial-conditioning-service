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
const common_1 = require("../../common");
class DecimalDegreeConverter extends kyber_server_1.BaseProcessor {
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
                        return reject({
                            message: `Invalid Latitude Coordinate: ${rawSubLat}`,
                            successful: false,
                        });
                    }
                    let formattedLon = '';
                    if (rawSubLon[0] === '+') {
                        formattedLon = rawSubLon.substr(1, LON_LENGTH - 1);
                    }
                    else if (rawSubLon[0] === '-') {
                        formattedLon = rawSubLon.substr(0, LON_LENGTH);
                    }
                    else {
                        return reject({
                            message: `Invalid Longitude Coordinate: ${rawSubLon}`,
                            successful: false,
                        });
                    }
                    arrCoords.push({
                        Height: '0',
                        Latitude: formattedLat,
                        Longitude: formattedLon,
                    });
                }
                if (arrCoords.length > 0) {
                    this.executionContext.raw.geoJson = common_1.Utilities.toGeoJSON(arrCoords);
                    this.executionContext.raw.wkt = common_1.Utilities.toWkt(arrCoords);
                    this.executionContext.raw.coordType = 'D';
                }
                return resolve({
                    successful: true,
                });
            }
            catch (err) {
                console.error(`DecimalDegreeConverter: ${err}`);
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
exports.DecimalDegreeConverter = DecimalDegreeConverter;
