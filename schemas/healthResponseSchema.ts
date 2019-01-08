import { SchemaDef } from 'kyber-server'

export class HealthResponseSchema extends SchemaDef {
    id = 'HealthResponseSchema'
    schema = {
        HealthCheck: {
            type: 'string'
        },
        Message: {
            type: 'string'
        },
        Database: {
            type: 'string'
        }
    }
}