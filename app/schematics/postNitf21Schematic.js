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
                dataType: 'string',
                name: 'ICOORDS',
                required: true,
                source: 'req.body.ICOORDS',
                whiteList: ['D', 'G', 'N', 'S', 'U'],
            },
            {
                dataType: 'string',
                name: 'IGEOLO',
                required: true,
                source: 'req.body.IGEOLO',
            },
        ];
        this.activities = [
            {
                activities: [],
                executionMode: kyber_server_1.ExecutionMode.Concurrent,
                id: 'DECISION-TREE',
                ordinal: 0,
                processes: [{
                        class: processors_1.Nitf21ICordsDecisionTree,
                    }],
            },
            {
                executionMode: kyber_server_1.ExecutionMode.Concurrent,
                id: 'COUNTRY-CODE-COMPOSER',
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
                class: kyber_server_1.RawResponse,
                httpStatus: 200,
                schema: schemas_1.DefaultResponseSchema,
            },
        ];
    }
}
exports.PostNitf21Schematic = PostNitf21Schematic;
