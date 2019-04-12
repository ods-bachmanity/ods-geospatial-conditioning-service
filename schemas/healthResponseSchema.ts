import { SchemaDef } from 'syber-server';

export class HealthResponseSchema extends SchemaDef {
    public id: string = 'HealthResponseSchema';

    public schema = {
        countryCodeService: {
            type: 'string',
            example: 'Reachable',
        },
        coordinateConversionService: {
            type: 'string',
            example: 'Reachable',
        },
        ODS: {
            type: 'object',
            properties: {
              Processors: {
                type: 'object',
                properties: {
                  geospatialConditioner: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'success',
                      },
                      timestamp: {
                        type: 'string',
                        example: '2019-03-09T21:50:04.376+00:00',
                      },
                      version: {
                        type: 'string',
                        example: '2.1.4',
                      },
                    },
                  },
                },
              },
            },
        },
    };
}
