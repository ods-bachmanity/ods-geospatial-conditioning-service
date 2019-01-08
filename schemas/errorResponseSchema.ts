import { SchemaDef } from 'kyber-server'

export class ErrorResponseSchema extends SchemaDef {
    id = 'ErrorResponseSchema'
    schema = {
        code: {
            type: 'integer'
        },
        message: {
            type: 'string'
        },
        correlationId: {
            type: 'string'
        },
        errors: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        warnings: {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    }
}