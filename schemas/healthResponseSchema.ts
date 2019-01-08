import { SchemaDef } from 'kyber-server';

export class HealthResponseSchema extends SchemaDef {
    public id = 'HealthResponseSchema';
    public schema = {
        Database: {
            type: 'string',
        },
        HealthCheck: {
            type: 'string',
        },
        Message: {
            type: 'string',
        },
    };
}
