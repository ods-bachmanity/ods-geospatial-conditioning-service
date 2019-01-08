"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
const composers_1 = require("../composers");
const schemas_1 = require("../schemas");
class HealthCheckGetSchematic extends kyber_server_1.Schematic {
    constructor() {
        super(...arguments);
        this.id = 'HealthCheckSchematic';
        this.description = 'Use GET verb to check the health of the service.';
        this.parameters = [];
        this.timeout = 10000;
        this.activities = [
            {
                id: 'COMPOSE',
                ordinal: 0,
                executionMode: kyber_server_1.ExecutionMode.Concurrent,
                processes: [{
                        class: composers_1.HealthCheckComposer
                    }],
                activities: []
            }
        ];
        this.responses = [
            {
                httpStatus: 200,
                class: kyber_server_1.RawResponse,
                schema: schemas_1.HealthResponseSchema
            }
        ];
    }
}
exports.HealthCheckGetSchematic = HealthCheckGetSchematic;
