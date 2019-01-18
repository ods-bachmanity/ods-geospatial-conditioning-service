"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
class ErrorResponse extends kyber_server_1.BaseProcessor {
    fx(args) {
        const result = new Promise((resolve, reject) => {
            try {
                let message = `Error in Geospatial Conditioning Service`;
                if (this.executionContext.httpStatus === 404) {
                    message = `Unable to locate path '${this.executionContext.req.path}'`;
                }
                if (this.executionContext.raw && typeof this.executionContext.raw === 'string') {
                    message = this.executionContext.raw;
                }
                return resolve({
                    data: {
                        code: -1,
                        comment: args ? args : undefined,
                        correlationId: this.executionContext.correlationId,
                        errors: this.executionContext.errors,
                        message,
                        warnings: this.executionContext.warnings,
                    },
                    httpStatus: this.executionContext.httpStatus,
                    message,
                    successful: false,
                });
            }
            catch (err) {
                return reject({
                    data: {
                        code: -1,
                        comment: args ? args : undefined,
                        correlationId: this.executionContext.correlationId,
                        errors: this.executionContext.errors,
                        message: `Error in Geospatial Conversion Service`,
                        warnings: this.executionContext.warnings,
                    },
                    httpStatus: 500,
                    message: `Error in Error Response`,
                    successful: false,
                });
            }
        });
        return result;
    }
}
exports.ErrorResponse = ErrorResponse;
