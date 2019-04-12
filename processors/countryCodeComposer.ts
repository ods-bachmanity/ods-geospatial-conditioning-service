import { BaseProcessor, ProcessorResponse, ProcessorErrorResponse } from 'syber-server';
import { CountryCodeService, Logger, Utilities } from '../common';

export class CountryCodeComposer extends BaseProcessor {

    public fx(): Promise<ProcessorResponse|ProcessorErrorResponse> {

        const result: Promise<ProcessorResponse|ProcessorErrorResponse> = new Promise(async (resolve, reject) => {

            try {
                const countryCodeService = new CountryCodeService(this.executionContext.correlationId, this.logger);

                const response = await countryCodeService.get(this.executionContext.document.wkt);
                this.executionContext.document.countries = response && response.rows ? response.rows : [];

                // Grab ODS.Processor return section from CountryCodeService
                this.executionContext.document.ODS = this.executionContext.document.ODS || {};
                this.executionContext.document.ODS.Processors = Object.assign({}, this.executionContext.document.ODS.Processors,
                    response.ODS.Processors);

                return resolve({
                    successful: true,
                });
            } catch (err) {
                return reject(this.handleError(err, `countryCodeComposer.fx`, 500));
            }
        });

        return result;
    }
}
/*
G: 483456N0430529E483324N0432144E482512N0432137E482641N0430529E
D: +52.000+000.000+53.000+000.000+53.000+001.000+52.000+001.000
U: 31TBG903992419830TXL230792129931TDF724380831831TDG0103982117
N: 402232752715025402461872715025402461872707109402232752707109
S: 536398687438792535950256897379542250796922124538019417363508
*/
