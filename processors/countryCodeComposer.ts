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
