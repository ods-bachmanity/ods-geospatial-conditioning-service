import { SchemaDef } from 'syber-server';

export class ErrorResponseSchema extends SchemaDef {
    public id = 'ErrorResponseSchema';
    public schema = {
        code: {
            type: 'integer',
        },
        correlationId: {
            type: 'string',
        },
        errors: {
            items: {
                type: 'string',
            },
            type: 'array',
        },
        message: {
            type: 'string',
        },
        warnings: {
            items: {
                type: 'string',
            },
            type: 'array',
        },
    };
}
