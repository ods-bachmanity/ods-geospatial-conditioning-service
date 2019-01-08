"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
class DefaultResponseSchema extends kyber_server_1.SchemaDef {
    constructor() {
        super(...arguments);
        this.id = 'DefaultResponseSchema';
        this.schema = {};
    }
}
exports.DefaultResponseSchema = DefaultResponseSchema;
