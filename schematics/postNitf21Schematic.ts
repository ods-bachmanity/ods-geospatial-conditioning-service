import { Activity, ExecutionMode, Parameter, Schematic, SchematicResponse } from 'kyber-server';
import { CountryCodeComposer, Nitf21ICoordsDecisionTree, Nitf21Response } from '../processors';
import { DefaultResponseSchema } from '../schemas';

export class PostNitf21Schematic extends Schematic {

    public id: string = 'PostNitf21Schematic';
    public description: string = 'Use POST verb to convert IGEOLO from D, G, N, S or U to DD for NITF2.1 metadata.';
    public parameters: Array<Parameter> = [
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
            required: false,
            source: 'req.body.fingerprint',
        },
    ];
    public timeout: number = 10000;
    public activities: Array<Activity> = [
    {
        executionMode: ExecutionMode.Concurrent,
        id: 'PROCESS-ICOORDS',
        ordinal: 0,
        processes: [{
            class: Nitf21ICoordsDecisionTree,
        }],
        activities: [{
            executionMode: ExecutionMode.Concurrent,
            id: 'PROCESS-COUNTRY-CODES',
            ordinal: 1,
            processes: [
                {
                    class: CountryCodeComposer,
                },
            ],
        }],
    },
    ];

    public responses: Array<SchematicResponse> = [
        {
            class: Nitf21Response,
            httpStatus: 200,
            schema: DefaultResponseSchema,
        },
    ];

}