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
const common_1 = require("../common");
class Nitf21Response extends syber_server_1.BaseProcessor {
    fx() {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const output = {};
            const countryOutput = [];
            output.GEO = {};
            output.GEO.WKT = this.executionContext.document.wkt;
            output.GEO.GeoJSON = this.executionContext.document.geoJson;
            output.GEO.MBR = this.executionContext.document.mbr;
            this.executionContext.document.countries.forEach((x) => countryOutput.push(x.GENC_3));
            output.GEO.CountryCodes = countryOutput;
            output.ODS = this.executionContext.document.ODS || {};
            output.ODS.Processors = Object.assign({}, this.executionContext.document.ODS.Processors, common_1.Utilities.getOdsProcessorJSON());
            resolve({
                data: { GEO: output.GEO, ODS: output.ODS },
                successful: true,
            });
        }));
        return result;
    }
}
exports.Nitf21Response = Nitf21Response;
