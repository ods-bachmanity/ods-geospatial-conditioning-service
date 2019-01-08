import { Schematic, Parameter, Activity, ExecutionMode, StartsWithAny, SchematicResponse, RawResponse, RawComposer } from 'kyber-server'
import { ErrorResponse } from '../common'
import { DefaultResponseSchema } from '../schemas'

export class PostNitf21Schematic extends Schematic {

    id: string = 'PostNitf21Schematic'
    description: string = 'Use POST verb to convert IGEOLO from D, G, N, S or U to DD.'
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
        id: 'COMPOSE',
        ordinal: 0,
        executionMode: ExecutionMode.Concurrent,
        processes: [{
            class: RawComposer,
            args: {
                hello: 'World'
            }
        }],
        activities: []
    }]

    responses: Array<SchematicResponse> = [
        {
            httpStatus: 200,
            class: RawResponse,
            schema: DefaultResponseSchema
        }
    ]

}