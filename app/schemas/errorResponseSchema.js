"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
class ErrorResponseSchema extends kyber_server_1.SchemaDef {
    constructor() {
        super(...arguments);
        this.id = 'ErrorResponseSchema';
        this.schema = {
            code: {
                type: 'integer',
            },
            correlationId: {
                type: 'string',
            },
            errors: {
                items: {
                    type: 'string',
                },
                type: 'array',
            },
            message: {
                type: 'string',
            },
            warnings: {
                items: {
                    type: 'string',
                },
                type: 'array',
            },
        };
    }
}
exports.ErrorResponseSchema = ErrorResponseSchema;
