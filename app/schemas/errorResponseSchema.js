"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
class ErrorResponseSchema extends kyber_server_1.SchemaDef {
    constructor() {
        super(...arguments);
        this.id = 'ErrorResponseSchema';
        this.schema = {
            code: {
                type: 'integer'
            },
            message: {
                type: 'string'
            },
            correlationId: {
                type: 'string'
            },
            errors: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            warnings: {
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        };
    }
}
exports.ErrorResponseSchema = ErrorResponseSchema;
