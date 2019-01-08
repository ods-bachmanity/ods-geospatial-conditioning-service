import { GlobalSchematic, SchematicResponse } from 'kyber-server';
import { ErrorResponse } from '../common';
import { ErrorResponseSchema } from '../schemas';

export class GeospatialConditioningServiceSchematic extends GlobalSchematic {

    public responses: Array<SchematicResponse> = [
        {
            class: ErrorResponse,
            httpStatus: 400,
            schema: ErrorResponseSchema,
        },
        {
            class: ErrorResponse,
            httpStatus: 404,
            schema: ErrorResponseSchema,
        },
        {
            class: ErrorResponse,
            httpStatus: 408,
            schema: ErrorResponseSchema,
        },
        {
            class: ErrorResponse,
            httpStatus: 500,
            schema: ErrorResponseSchema,
        },
        {
            class: ErrorResponse,
            httpStatus: 0,
            schema: ErrorResponseSchema,
        },
    ];

}
