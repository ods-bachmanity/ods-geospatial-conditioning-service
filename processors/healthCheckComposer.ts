import { BaseProcessor, ProcessorResponse } from 'kyber-server';
import { CoordinateConversionService, CountryCodeService, Utilities } from '../common';

export class HealthCheckComposer extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                // Check dependent services to see if they are reachable.

                // Check Country Code
                const countryCodeService = new CountryCodeService(this.executionContext.correlationId);

                const countryResponse = await countryCodeService.getHealth();
                this.executionContext.raw.countryCodeService = countryResponse && countryResponse.healthy ? 'Reachable' : 'Unreachable';

                // Check Coordinate Conversion
                const coordinateConversionService = new CoordinateConversionService(this.executionContext.correlationId);

                const coordResponse = await coordinateConversionService.getHealth();
                this.executionContext.raw.coordinateConversionService = coordResponse && coordResponse.healthy ? 'Reachable' : 'Unreachable';

                // Add ODS.Processors return structure to health check.
                this.executionContext.raw.ODS = this.executionContext.raw.ODS || {};
                this.executionContext.raw.ODS.Processors = this.executionContext.raw.ODS.Processors || {};
                this.executionContext.raw.ODS.Processors = Object.assign({}, Utilities.getOdsProcessorJSON());
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
