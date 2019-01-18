"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
const processors_1 = require("../processors");
const schemas_1 = require("../schemas");
class PostNitf21Schematic extends kyber_server_1.Schematic {
    constructor() {
        super(...arguments);
        this.id = 'PostNitf21Schematic';
        this.description = 'Use POST verb to convert IGEOLO from D, G, N, S or U to DD for NITF2.1 metadata.';
        this.parameters = [
            {
                name: 'ICORDS',
                dataType: 'string',
                required: true,
                source: 'req.body.ICORDS',
                whiteList: ['D', 'G', 'N', 'S', 'U'],
            },
            {
                name: 'IGEOLO',
                dataType: 'string',
                required: true,
                source: 'req.body.IGEOLO',
            },
            {
                name: 'fingerprint',
                dataType: 'string',
                required: true,
                source: 'req.body.fingerprint',
            },
        ];
        this.timeout = 10000;
        this.activities = [
            {
                executionMode: kyber_server_1.ExecutionMode.Concurrent,
                id: 'PROCESS-ICOORDS',
                ordinal: 0,
                processes: [{
                        class: processors_1.Nitf21ICoordsDecisionTree,
                    }],
            },
            {
                executionMode: kyber_server_1.ExecutionMode.Concurrent,
                id: 'PROCESS-COUNTRY-CODES',
                ordinal: 1,
                processes: [
                    {
                        class: processors_1.CountryCodeComposer,
                    },
                ],
            }
        ];
        this.responses = [
            {
                class: processors_1.Nitf21Response,
                httpStatus: 200,
                schema: schemas_1.DefaultResponseSchema,
            },
        ];
    }
}
exports.PostNitf21Schematic = PostNitf21Schematic;
