"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syber_server_1 = require("syber-server");
class ErrorResponse extends syber_server_1.BaseProcessor {
    fx() {
        const result = new Promise((resolve, reject) => {
            try {
                let message = `Error in Geospatial Conditioning Service`;
                if (this.executionContext.httpStatus === 404) {
                    message = `Unable to locate path '${this.executionContext.req.path}'`;
                }
                if (this.executionContext.document && typeof this.executionContext.document === 'string') {
                    message = this.executionContext.document;
                }
                return resolve({
                    data: {
                        code: -1,
                        comment: this.processorDef.args ? this.processorDef.args : undefined,
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
                        comment: this.processorDef.args ? this.processorDef.args : undefined,
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
