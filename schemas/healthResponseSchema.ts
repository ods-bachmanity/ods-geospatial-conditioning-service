import { SchemaDef } from 'kyber-server';

export class HealthResponseSchema extends SchemaDef {
    public id: string = 'HealthResponseSchema';

    public schema = {
        countryCodeService: {
            type: 'string',
        },
        coordinateConversionService: {
            type: 'string',
        },
        ODS: {
            type: 'object' as string,
        },
    };
/*     public schema: any = {
    }; */
}
