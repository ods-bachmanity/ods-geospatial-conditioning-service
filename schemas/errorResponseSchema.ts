import { SchemaDef } from 'syber-server';

export class ErrorResponseSchema extends SchemaDef {
    public id = 'ErrorResponseSchema';
    public schema = {
        code: {
            type: 'integer',
            example: 0,
        },
        correlationId: {
            type: 'string',
            example: 'adc12de0-7e85-40a4-ad84-6fe0d05889b3',
        },
        errors: {
            items: {
                type: 'string',
            },
            type: 'array',
        },
        message: {
            type: 'string',
            example: 'OK',
        },
        warnings: {
            items: {
                type: 'string',
            },
            type: 'array',
        },
    };
}
