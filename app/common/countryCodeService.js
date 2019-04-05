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
class CountryCodeService {
    constructor(correlationId, logger) {
        this.correlationId = correlationId;
        this.logger = logger;
        this.servicePath = process.env.COUNTRYCODESERVICE_BASEURL;
        this.healthEndpoint = process.env.COUNTRYCODESERVICE_HEALTHENDPOINT;
        this.countriesEndpoint = process.env.COUNTRYCODESERVICE_COUNTRIESENDPOINT;
    }
    get(wktInput) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Country Code Service`, `COUNTRYCODESERVICE.GET`);
                    return reject({ message: `Invalid Service Path for Country Code Service, update environment value for COUNTRYCODESERVICE_BASEURL` });
                }
                if (!this.countriesEndpoint) {
                    this.logger.error(this.correlationId, `Invalid countries endpoint for Country Code Service`, `COUNTRYCODESERVICE.GET`);
                    return reject({ message: `Invalid countries endpoint for Country Code Service, update environment value for COUNTRYCODESERVICE_COUNTRIESENDPOINT` });
                }
                if (!wktInput) {
                    this.logger.warn(this.correlationId, `Attempt to retrieve country code list for empty wkt string`, `COUNTRYCODESERVICE.GET`);
                    return resolve(undefined);
                }
                const response = yield rp.post({
                    body: JSON.stringify({
                        wkt: wktInput,
                    }),
                    headers: { 'content-type': 'application/json' },
                    url: this.servicePath + this.countriesEndpoint,
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
    getHealth() {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Country Code Service`, `COUNTRYCODESERVICE.GETHEALTH`);
                    return reject({ message: `Invalid Service Path for Country Code Service, update environment value for COUNTRYCODESERVICE_BASEURL` });
                }
                if (!this.healthEndpoint) {
                    this.logger.error(this.correlationId, `Invalid health endpoint for Country Code Service`, `COUNTRYCODESERVICE.GETHEALTH`);
                    return reject({ message: `Invalid health endpoint for Country Code Service, update environment value for COUNTRYCODESERVICE_HEALTHENDPOINT` });
                }
                const response = yield rp.get({
                    url: this.servicePath + this.healthEndpoint,
                });
                const body = JSON.parse(response);
                body.healthy = true;
                return resolve(body);
            }
            catch (err) {
                this.logger.error(this.correlationId, `Warning, cannot reach Country Code Service: ${err.message}`, `COUNTRYCODESERVICE.GETHEALTH`);
                return resolve(err);
            }
        }));
        return result;
    }
}
exports.CountryCodeService = CountryCodeService;
