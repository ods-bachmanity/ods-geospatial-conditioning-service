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
class HealthCheckComposer extends kyber_server_1.BaseProcessor {
    fx(args) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.executionContext.raw.ODS) {
                    this.executionContext.raw.ODS = {};
                }
                if (!this.executionContext.raw.ODS.Processors) {
                    this.executionContext.raw.ODS.Processors = {};
                }
                this.executionContext.raw.ODS.Processors = Object.assign({}, common_1.Utilities.getOdsProcessorJSON('No Rest for Old Men', true));
                return resolve({
                    successful: true,
                });
            }
            catch (err) {
                console.error(`HealthCheckComposer: ${err}`);
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
exports.HealthCheckComposer = HealthCheckComposer;
