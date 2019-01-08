import { Activity, ExecutionMode, Parameter, RawResponse, Schematic, SchematicResponse } from 'kyber-server';
import { CountryCodeComposer, Nitf21ICordsDecisionTree } from '../processors';
import { DefaultResponseSchema } from '../schemas';

export class PostNitf21Schematic extends Schematic {

    public id: string = 'PostNitf21Schematic';
    public description: string = 'Use POST verb to convert IGEOLO from D, G, N, S or U to DD for NITF2.1 metadata.';
    public parameters: Array<Parameter> = [
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

    public activities: Array<Activity> = [
    {
        activities: [],
        executionMode: ExecutionMode.Concurrent,
        id: 'DECISION-TREE',
        ordinal: 0,
        processes: [{
            class: Nitf21ICordsDecisionTree,
        }],
    },
    {
        executionMode: ExecutionMode.Concurrent,
        id: 'COUNTRY-CODE-COMPOSER',
        ordinal: 1,
        processes: [
            {
                class: CountryCodeComposer,
            },
        ],
    }];

    public responses: Array<SchematicResponse> = [
        {
            class: RawResponse,
            httpStatus: 200,
            schema: DefaultResponseSchema,
        },
    ];

}
