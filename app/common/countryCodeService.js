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
const rp = require("request-promise");
const logger_1 = require("./logger");
class CountryCodeService {
    constructor(correlationId) {
        this.correlationId = correlationId;
        this.servicePath = process.env.COUNTRYCODESERVICEURL;
        this.logger = new logger_1.Logger();
    }
    get(wktInput) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Country Code Service`, `COUNTRYCODESERVICE.GET`);
                    return reject({ message: `Invalid Service Path for Country Code Service` });
                }
                if (!wktInput) {
                    this.logger.log(this.correlationId, `Attempt to retrieve country code list for empty wkt string`, `COUNTRYCODESERVICE.GET`);
                    return resolve(undefined);
                }
                const response = yield rp.post({
                    body: JSON.stringify({
                        wkt: wktInput,
                    }),
                    headers: { 'content-type': 'application/json' },
                    url: this.servicePath,
                });
                const records = JSON.parse(response);
                return resolve(records);
            }
            catch (err) {
                this.logger.error(this.correlationId, `Error in Country Code Service: ${err.message}`, `COUNTRYCODESERVICE.GET`);
                return reject(err);
            }
        }));
        return result;
    }
}
exports.CountryCodeService = CountryCodeService;
