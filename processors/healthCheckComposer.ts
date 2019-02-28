import { BaseProcessor, ProcessorResponse } from 'kyber-server';
import { Utilities } from '../common';

export class HealthCheckComposer extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                // Add ODS.Processors return structure to health check.
                if (!this.executionContext.raw.ODS) { this.executionContext.raw.ODS = {}; }
                if (!this.executionContext.raw.ODS.Processors) { this.executionContext.raw.ODS.Processors  = {}; }
                this.executionContext.raw.ODS.Processors = Object.assign({}, Utilities.getOdsProcessorJSON('No Rest for Old Men', true));
                return resolve({
                    successful: true,
                });
            } catch (err) {
                console.error(`HealthCheckComposer: ${err}`);
                return reject({
                    httpStatus: 500,
                    message: `${err}`,
                    successful: false,
                });
            }
        });

        return result;

    }
}
