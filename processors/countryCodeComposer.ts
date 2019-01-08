import { BaseProcessor, ProcessorResponse } from 'kyber-server';

export class CountryCodeComposer extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                this.executionContext.raw.country = 'USA';
                return resolve({
                    successful: true,
                });
            } catch (err) {
                console.error(`CountryCodeComposer: ${err}`);
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
