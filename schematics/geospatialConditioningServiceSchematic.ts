import { GlobalSchematic, SchematicResponse } from 'kyber-server'
import { ErrorResponse } from '../common'
import { ErrorResponseSchema } from '../schemas'

export class GeospatialConditioningServiceSchematic extends GlobalSchematic {

    responses: Array<SchematicResponse> = [
        {
            httpStatus: 400,
            class: ErrorResponse,
            schema: ErrorResponseSchema
        },
        {
            httpStatus: 404,
            class: ErrorResponse,
            schema: ErrorResponseSchema
        },
        {
            httpStatus: 408,
            class: ErrorResponse,
            schema: ErrorResponseSchema
        },
        {
            httpStatus: 500,
            class: ErrorResponse,
            schema: ErrorResponseSchema
        },
        {
            httpStatus: 0,
            class: ErrorResponse,
            schema: ErrorResponseSchema
        }
    ]

}

