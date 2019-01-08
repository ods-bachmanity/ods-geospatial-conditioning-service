"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
class ErrorResponse extends kyber_server_1.BaseProcessor {
    fx(args) {
        const result = new Promise((resolve, reject) => {
            try {
                let message = `Error in Geospatial Conversion Service`;
                if (this.executionContext.httpStatus === 404) {
                    message = `Unable to locate path '${this.executionContext.req.path}'`;
                }
                if (this.executionContext.raw && typeof this.executionContext.raw === 'string') {
                    message = this.executionContext.raw;
                }
                return resolve({
                    successful: false,
                    message: message,
                    httpStatus: this.executionContext.httpStatus,
                    data: {
                        code: -1,
                        message: message,
                        correlationId: this.executionContext.correlationId,
                        errors: this.executionContext.errors,
                        warnings: this.executionContext.warnings,
                        comment: args ? args : undefined
                    }
                });
            }
            catch (err) {
                return reject({
                    successful: false,
                    message: `Error in Error Response`,
                    httpStatus: 500,
                    data: {
                        code: -1,
                        message: `Error in Geospatial Conversion Service`,
                        correlationId: this.executionContext.correlationId,
                        errors: this.executionContext.errors,
                        warnings: this.executionContext.warnings,
                        comment: args ? args : undefined
                    }
                });
            }
        });
        return result;
    }
}
exports.ErrorResponse = ErrorResponse;
