"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
class HealthResponseSchema extends kyber_server_1.SchemaDef {
    constructor() {
        super(...arguments);
        this.id = 'HealthResponseSchema';
        this.schema = {
            HealthCheck: {
                type: 'string'
            },
            Message: {
                type: 'string'
            },
            Database: {
                type: 'string'
            }
        };
    }
}
exports.HealthResponseSchema = HealthResponseSchema;
