"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syber_server_1 = require("syber-server");
class ErrorResponseSchema extends syber_server_1.SchemaDef {
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
