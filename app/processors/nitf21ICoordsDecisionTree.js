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
const nitf21GeospatialConverters_1 = require("./nitf21GeospatialConverters");
class Nitf21ICoordsDecisionTree extends syber_server_1.BaseProcessor {
    fx() {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const icords = this.executionContext.getParameterValue('ICORDS');
                this.executionContext.document = Object.assign({}, {
                    icords,
                    igeolo: this.executionContext.getParameterValue('IGEOLO'),
                });
                let response;
                switch (icords) {
                    case 'D':
                        const decimalDegreeConverter = new nitf21GeospatialConverters_1.DecimalDegreeConverter(this.executionContext, this.processorDef, this.logger);
                        response = yield decimalDegreeConverter.fx();
                        return resolve(response);
                    case 'G':
                        const geographicCoordsConverter = new nitf21GeospatialConverters_1.GeographicCoordsConverter(this.executionContext, this.processorDef, this.logger);
                        response = yield geographicCoordsConverter.fx();
                        return resolve(response);
                    case 'U':
                        const utmmgrsCoordConverter = new nitf21GeospatialConverters_1.UTMMGRSCoordsConverter(this.executionContext, this.processorDef, this.logger);
                        response = yield utmmgrsCoordConverter.fx();
                        return resolve(response);
                    case 'N':
                        const utmNorthCoordConverter = new nitf21GeospatialConverters_1.UTMNorthCoordsConverter(this.executionContext, this.processorDef, this.logger);
                        response = yield utmNorthCoordConverter.fx();
                        return resolve(response);
                    case 'S':
                        const utmSouthCoordConverter = new nitf21GeospatialConverters_1.UTMSouthCoordsConverter(this.executionContext, this.processorDef, this.logger);
                        response = yield utmSouthCoordConverter.fx();
                        return resolve(response);
                    default:
                        return reject(this.handleError({ message: `Invalid ICORDS Value Detected: ${icords}` }, `nitf21ICoordsDecisionTree.fx`, 400));
                }
            }
            catch (err) {
                return reject(this.handleError(err, `nitf21ICoordsDecisionTree.fx`, 500));
            }
        }));
        return result;
    }
}
exports.Nitf21ICoordsDecisionTree = Nitf21ICoordsDecisionTree;
