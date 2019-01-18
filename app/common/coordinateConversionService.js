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
class CoordinateConversionService {
    constructor(correlationId) {
        this.correlationId = correlationId;
        this.servicePath = process.env.COORDCONVERSIONSERVICEURL;
        this.logger = new logger_1.Logger();
    }
    get(requestBody) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Coordinate Conversion Service`, `COORDINATECONVERSIONSERVICE.GET`);
                    return reject(`Invalid Service Path for Coordinate Conversion Service`);
                }
                if (!requestBody) {
                    this.logger.log(this.correlationId, `Invalid Request body in Coordinate Conversion Service Call`, `COORDINATECONVERSIONSERVICE.GET`);
                    return resolve(undefined);
                }
                const response = yield rp.post({
                    body: JSON.stringify(requestBody),
                    headers: { 'content-type': 'application/json' },
                    url: this.servicePath,
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
}
exports.CoordinateConversionService = CoordinateConversionService;
