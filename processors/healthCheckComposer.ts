import { BaseProcessor, ProcessorResponse, ProcessorErrorResponse } from 'syber-server';
import { CoordinateConversionService, CountryCodeService, Utilities } from '../common';

export class HealthCheckComposer extends BaseProcessor {

    public fx(): Promise<ProcessorResponse|ProcessorErrorResponse> {

        const result: Promise<ProcessorResponse|ProcessorErrorResponse> = new Promise(async (resolve, reject) => {

            try {
                // Check dependent services to see if they are reachable.

                // Check Country Code
                const countryCodeService = new CountryCodeService(this.executionContext.correlationId, this.logger);

                const countryResponse = await countryCodeService.getHealth();
                this.executionContext.document.countryCodeService = countryResponse && countryResponse.healthy ? 'Reachable' : 'Unreachable';

                // Check Coordinate Conversion
                const coordinateConversionService = new CoordinateConversionService(this.executionContext.correlationId, this.logger);

                const coordResponse = await coordinateConversionService.getHealth();
                this.executionContext.document.coordinateConversionService = coordResponse && coordResponse.healthy ? 'Reachable' : 'Unreachable';

                // Add ODS.Processors return structure to health check.
                this.executionContext.document.ODS = this.executionContext.document.ODS || {};
                this.executionContext.document.ODS.Processors = this.executionContext.document.ODS.Processors || {};
                this.executionContext.document.ODS.Processors = Object.assign({}, Utilities.getOdsProcessorJSON());
                return resolve({
                    successful: true,
                });
            } catch (err) {
                return reject(this.handleError(err, `healthCheckComposer.fx`, 500));
            }
        });

        return result;

    }
}
