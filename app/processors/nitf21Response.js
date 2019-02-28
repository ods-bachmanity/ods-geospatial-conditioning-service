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
const common_1 = require("../common");
class Nitf21Response extends kyber_server_1.BaseProcessor {
    fx(args) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const output = {};
            const countryOutput = [];
            output.GEO = {};
            output.GEO.WKT = this.executionContext.raw.wkt;
            output.GEO.GeoJSON = this.executionContext.raw.geoJson;
            this.executionContext.raw.countries.forEach((x) => countryOutput.push(x.GENC_3));
            output.GEO.CountryCodes = countryOutput;
            if (!this.executionContext.raw.ods) {
                this.executionContext.raw.ods = {};
            }
            if (!this.executionContext.raw.ods.processors) {
                this.executionContext.raw.ods.processors = [];
            }
            this.executionContext.raw.ods.processors.push(common_1.Utilities.getOdsProcessorJSON('success', false));
            output.ODS = {};
            output.ODS.Processors = {};
            this.executionContext.raw.ods.processors.forEach((item) => {
                const keynames = Object.keys(item);
                keynames.forEach((keyname) => {
                    output.ODS.Processors[keyname] = item[keyname];
                });
            });
            resolve({
                data: { GEO: output.GEO, ODS: output.ODS },
                successful: true,
            });
        }));
        return result;
    }
}
exports.Nitf21Response = Nitf21Response;
