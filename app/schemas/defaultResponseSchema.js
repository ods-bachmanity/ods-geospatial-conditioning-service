"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syber_server_1 = require("syber-server");
class DefaultResponseSchema extends syber_server_1.SchemaDef {
    constructor() {
        super(...arguments);
        this.id = 'DefaultResponseSchema';
        this.schema = {};
    }
}
exports.DefaultResponseSchema = DefaultResponseSchema;
