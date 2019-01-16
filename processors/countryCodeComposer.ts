import { BaseProcessor, ProcessorResponse } from 'kyber-server';
import { CountryCodeService, Logger } from '../common';

export class CountryCodeComposer extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                const countryCodeService = new CountryCodeService(this.executionContext.correlationId);
                const response = await countryCodeService.get(this.executionContext.raw.wkt);
                this.executionContext.raw.countries = response && response.rows ? response.rows : [];
                return resolve({
                    successful: true,
                });
            } catch (err) {
                console.error(`CountryCodeComposer: ${err}`);
                return reject({
                    httpStatus: 500,
                    message: `${err.message}`,
                    successful: false,
                });
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
