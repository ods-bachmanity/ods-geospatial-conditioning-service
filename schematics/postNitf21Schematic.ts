import { Schematic, Parameter, Activity, ExecutionMode, SchematicResponse, RawResponse } from 'kyber-server'
import { DefaultResponseSchema } from '../schemas'
import { Nitf21ICordsDecisionTree, CountryCodeComposer } from '../processors'

export class PostNitf21Schematic extends Schematic {

    id: string = 'PostNitf21Schematic'
    description: string = 'Use POST verb to convert IGEOLO from D, G, N, S or U to DD for NITF2.1 metadata.'
    parameters: Array<Parameter> = [
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
    ]
    
    sharedResources: Array<any> = []

    activities: Array<Activity> = [
    {
        id: 'DECISION-TREE',
        ordinal: 0,
        executionMode: ExecutionMode.Concurrent,
        processes: [{
            class: Nitf21ICordsDecisionTree
        }],
        activities: []
    },
    {
        id: 'COUNTRY-CODE-COMPOSER',
        ordinal: 1,
        executionMode: ExecutionMode.Concurrent,
        processes: [
            {
                class: CountryCodeComposer
            }
        ]
    }]

    responses: Array<SchematicResponse> = [
        {
            httpStatus: 200,
            class: RawResponse,
            schema: DefaultResponseSchema
        }
    ]

}