"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
const schemas_1 = require("../schemas");
const processors_1 = require("../processors");
class PostNitf21Schematic extends kyber_server_1.Schematic {
    constructor() {
        super(...arguments);
        this.id = 'PostNitf21Schematic';
        this.description = 'Use POST verb to convert IGEOLO from D, G, N, S or U to DD for NITF2.1 metadata.';
        this.parameters = [
            {
                name: 'ICOORDS',
                source: 'req.body.ICOORDS',
                required: true,
                dataType: 'string',
                whiteList: ['D', 'G', 'N', 'S', 'U']
            },
            {
                name: 'IGEOLO',
                source: 'req.body.IGEOLO',
                required: true,
                dataType: 'string'
            }
        ];
        this.sharedResources = [];
        this.activities = [
            {
                id: 'DECISION-TREE',
                ordinal: 0,
                executionMode: kyber_server_1.ExecutionMode.Concurrent,
                processes: [{
                        class: processors_1.Nitf21ICordsDecisionTree
                    }],
                activities: []
            },
            {
                id: 'COUNTRY-CODE-COMPOSER',
                ordinal: 1,
                executionMode: kyber_server_1.ExecutionMode.Concurrent,
                processes: [
                    {
                        class: processors_1.CountryCodeComposer
                    }
                ]
            }
        ];
        this.responses = [
            {
                httpStatus: 200,
                class: kyber_server_1.RawResponse,
                schema: schemas_1.DefaultResponseSchema
            }
        ];
    }
}
exports.PostNitf21Schematic = PostNitf21Schematic;
