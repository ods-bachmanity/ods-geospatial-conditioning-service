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
const nitf21GeospatialConverters_1 = require("./nitf21GeospatialConverters");
class Nitf21ICordsDecisionTree extends kyber_server_1.BaseProcessor {
    fx(args) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const icoords = this.executionContext.getParameterValue('ICOORDS');
                this.executionContext.raw = Object.assign({}, {
                    icords: icoords,
                    igeolo: this.executionContext.getParameterValue('IGEOLO'),
                });
                switch (icoords) {
                    case 'D':
                        const decimalDegreeConverter = new nitf21GeospatialConverters_1.DecimalDegreeConverter(this.executionContext, this.processorDef);
                        yield decimalDegreeConverter.fx(args);
                        return resolve({
                            successful: true,
                        });
                    case 'G':
                        const geodeticCoordConverter = new nitf21GeospatialConverters_1.GeodeticCoordsConverter(this.executionContext, this.processorDef);
                        yield geodeticCoordConverter.fx(args);
                        return resolve({
                            successful: true,
                        });
                    case 'U':
                        const utmmgrsCoordConverter = new nitf21GeospatialConverters_1.UTMMGRSCoordsConverter(this.executionContext, this.processorDef);
                        yield utmmgrsCoordConverter.fx(args);
                        return resolve({
                            successful: true,
                        });
                    case 'N':
                        const utmNorthCoordConverter = new nitf21GeospatialConverters_1.UTMNorthCoordsConverter(this.executionContext, this.processorDef);
                        yield utmNorthCoordConverter.fx(args);
                        return resolve({
                            successful: true,
                        });
                    case 'S':
                        const utmSouthCoordConverter = new nitf21GeospatialConverters_1.UTMSouthCoordsConverter(this.executionContext, this.processorDef);
                        yield utmSouthCoordConverter.fx(args);
                        return resolve({
                            successful: true,
                        });
                    default:
                        return reject({
                            httpStatus: 400,
                            message: `Invalid ICOORDS Value Detected: ${icoords}`,
                            successful: false,
                        });
                }
            }
            catch (err) {
                console.error(`Nitf21ICordsDecisionTree: ${err}`);
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
exports.Nitf21ICordsDecisionTree = Nitf21ICordsDecisionTree;
