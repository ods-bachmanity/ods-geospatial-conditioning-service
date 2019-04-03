import { Activity, ExecutionMode, Parameter, RawResponse, Schematic, SchematicResponse } from 'syber-server';
import { ErrorResponse } from '../common';
import { HealthCheckComposer } from '../processors';
import { HealthResponseSchema } from '../schemas';

export class HealthCheckGetSchematic extends Schematic {

    public id: string = 'HealthCheckSchematic';
    public description: string = 'Use GET verb to check the health of the service.';
    public parameters: Array<Parameter> = [];
    public timeout: number = 10000;

    public activities: Array<Activity> = [
    {
        activities: [],
        executionMode: ExecutionMode.Concurrent,
        id: 'COMPOSE',
        ordinal: 0,
        processes: [{
            class: HealthCheckComposer,
        }],
    }];

    public responses: Array<SchematicResponse> = [
        {
            class: RawResponse,
            httpStatus: 200,
            schema: HealthResponseSchema,
        },
    ];

}
