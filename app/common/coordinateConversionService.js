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
class CoordinateConversionService {
    constructor(correlationId, logger) {
        this.correlationId = correlationId;
        this.logger = logger;
        this.servicePath = process.env.COORDCONVERSIONSERVICE_BASEURL;
        this.healthEndpoint = process.env.COORDCONVERSIONSERVICE_HEALTHENDPOINT;
        this.conversionEndpoint = process.env.COORDCONVERSIONSERVICE_CONVERSIONENDPOINT;
    }
    get(requestBody) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Coordinate Conversion Service`, `COORDINATECONVERSIONSERVICE.GET`);
                    return reject(`Invalid Service Path for Coordinate Conversion Service, update environment value for COORDCONVERSIONSERVICE_BASEURL`);
                }
                if (!this.conversionEndpoint) {
                    this.logger.error(this.correlationId, `Invalid conversion endpoint for Coordinate Conversion Service`, `COORDINATECONVERSIONSERVICE.GET`);
                    return reject({ message: `Invalid conversion endpoint for Coordinate Conversion Service, update environment value for COORDCONVERSIONSERVICE_CONVERSIONENDPOINT` });
                }
                if (!requestBody) {
                    this.logger.warn(this.correlationId, `Invalid Request body in Coordinate Conversion Service Call`, `COORDINATECONVERSIONSERVICE.GET`);
                    return resolve(undefined);
                }
                const response = yield rp.post({
                    body: JSON.stringify(requestBody),
                    headers: { 'content-type': 'application/json' },
                    url: this.servicePath + this.conversionEndpoint,
                });
                const records = JSON.parse(response);
                return resolve(records);
            }
            catch (err) {
                this.logger.error(this.correlationId, `Error in Coordinate Conversion Service: ${err.message}`, `COORDINATECONVERSIONSERVICE.GET`);
                return reject(err);
            }
        }));
        return result;
    }
    getHealth() {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Coordinate Conversion Service`, `COORDINATECONVERSIONSERVICE.GETHEALTH`);
                    return reject({ message: `Invalid Service Path for Coordinate Conversion Service, update environment value for COORDCONVERSIONSERVICE_BASEURL` });
                }
                if (!this.healthEndpoint) {
                    this.logger.error(this.correlationId, `Invalid health endpoint for Coordinate Conversion Service`, `COORDINATECONVERSIONSERVICE.GETHEALTH`);
                    return reject({ message: `Invalid health endpoint for Coordinate Conversion Service, update environment value for COORDCONVERSIONSERVICE_HEALTHENDPOINT` });
                }
                const response = yield rp.get({
                    url: this.servicePath + this.healthEndpoint,
                });
                const body = JSON.parse(response);
                body.healthy = true;
                return resolve(body);
            }
            catch (err) {
                this.logger.warn(this.correlationId, `Warning, cannot reach Coordinate Conversion Service: ${err.message}`, `COORDINATECONVERSIONSERVICE.GETHEALTH`);
                return resolve(err);
            }
        }));
        return result;
    }
}
exports.CoordinateConversionService = CoordinateConversionService;
