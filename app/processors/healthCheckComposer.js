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
class HealthCheckComposer extends syber_server_1.BaseProcessor {
    fx() {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const countryCodeService = new common_1.CountryCodeService(this.executionContext.correlationId, this.logger);
                const countryResponse = yield countryCodeService.getHealth();
                this.executionContext.document.countryCodeService = countryResponse && countryResponse.healthy ? 'Reachable' : 'Unreachable';
                const coordinateConversionService = new common_1.CoordinateConversionService(this.executionContext.correlationId, this.logger);
                const coordResponse = yield coordinateConversionService.getHealth();
                this.executionContext.document.coordinateConversionService = coordResponse && coordResponse.healthy ? 'Reachable' : 'Unreachable';
                this.executionContext.document.ODS = this.executionContext.document.ODS || {};
                this.executionContext.document.ODS.Processors = this.executionContext.document.ODS.Processors || {};
                this.executionContext.document.ODS.Processors = Object.assign({}, common_1.Utilities.getOdsProcessorJSON());
                return resolve({
                    successful: true,
                });
            }
            catch (err) {
                return reject(this.handleError(err, `healthCheckComposer.fx`, 500));
            }
        }));
        return result;
    }
}
exports.HealthCheckComposer = HealthCheckComposer;
