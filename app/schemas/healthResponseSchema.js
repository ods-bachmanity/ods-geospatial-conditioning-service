"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syber_server_1 = require("syber-server");
class HealthResponseSchema extends syber_server_1.SchemaDef {
    constructor() {
        super(...arguments);
        this.id = 'HealthResponseSchema';
        this.schema = {
            countryCodeService: {
                type: 'string',
            },
            coordinateConversionService: {
                type: 'string',
            },
            ODS: {
                type: 'object',
            },
        };
    }
}
exports.HealthResponseSchema = HealthResponseSchema;
