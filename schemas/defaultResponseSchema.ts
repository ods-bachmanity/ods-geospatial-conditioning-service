import { SchemaDef } from 'syber-server';

export class DefaultResponseSchema extends SchemaDef {
    public id = 'DefaultResponseSchema';
    public schema: any = {
        GEO: {
            type: 'object',
            properties: {
              WKT: {
                type: 'string',
                example: 'POLYGON ((000.000 52.000,000.000 53.000,001.000 53.000,001.000 52.000,000.000 52.000))',
              },
              GeoJSON: {
                type: 'object',
                properties: {
                  coordinates: {
                    type: 'array',
                    items: {
                      type: 'array',
                      items: {
                        type: 'array',
                        items: {
                          type: 'integer',
                          example: 0,
                        },
                      },
                    },
                  },
                  type: {
                    type: 'string',
                    example: 'Polygon',
                  },
                },
              },
              MBR: {
                type: 'string',
                example: 'RECTANGLE (000.000 52.000,001.000 53.000)',
              },
              CountryCodes: {
                type: 'array',
                items: {
                  type: 'string',
                  example: 'GBR',
                },
              },
            },
          },
          ODS: {
            type: 'object',
            properties: {
              Processors: {
                type: 'object',
                properties: {
                  countrycode: {
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
                        example: '2.0.13',
                      },
                    },
                  },
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
                        example: '2.1.3',
                      },
                    },
                  },
                },
              },
            },
        },
    };
}
