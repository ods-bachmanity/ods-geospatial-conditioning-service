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
class CountryCodeComposer extends kyber_server_1.BaseProcessor {
    fx(args) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const countryCodeService = new common_1.CountryCodeService(this.executionContext.correlationId);
                console.log(`\n\n\nCALLING COUNTRY CODE SERVICE WITH ${this.executionContext.raw.wkt}\n\n\n`);
                const response = yield countryCodeService.get(this.executionContext.raw.wkt);
                this.executionContext.raw.countries = response && response.rows ? response.rows : [];
                if (!this.executionContext.raw.ods) {
                    this.executionContext.raw.ods = {};
                }
                if (!this.executionContext.raw.ods.processors) {
                    this.executionContext.raw.ods.processors = [];
                }
                if (response && response.ODS && response.ODS.Processors) {
                    this.executionContext.raw.ods.processors.push(response.ODS.Processors);
                }
                console.log(`\n\nCOUNTRY CODE SERVICE RESPONSE: ${JSON.stringify(response, null, 1)}\n\n`);
                return resolve({
                    successful: true,
                });
            }
            catch (err) {
                console.error(`CountryCodeComposer: ${err}`);
                return reject({
                    httpStatus: 500,
                    message: `${err.message}`,
                    successful: false,
                });
            }
        }));
        return result;
    }
}
exports.CountryCodeComposer = CountryCodeComposer;
