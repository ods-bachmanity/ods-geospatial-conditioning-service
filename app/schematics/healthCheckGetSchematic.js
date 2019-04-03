"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syber_server_1 = require("syber-server");
const processors_1 = require("../processors");
const schemas_1 = require("../schemas");
class HealthCheckGetSchematic extends syber_server_1.Schematic {
    constructor() {
        super(...arguments);
        this.id = 'HealthCheckSchematic';
        this.description = 'Use GET verb to check the health of the service.';
        this.parameters = [];
        this.timeout = 10000;
        this.activities = [
            {
                activities: [],
                executionMode: syber_server_1.ExecutionMode.Concurrent,
                id: 'COMPOSE',
                ordinal: 0,
                processes: [{
                        class: processors_1.HealthCheckComposer,
                    }],
            }
        ];
        this.responses = [
            {
                class: syber_server_1.RawResponse,
                httpStatus: 200,
                schema: schemas_1.HealthResponseSchema,
            },
        ];
    }
}
exports.HealthCheckGetSchematic = HealthCheckGetSchematic;
