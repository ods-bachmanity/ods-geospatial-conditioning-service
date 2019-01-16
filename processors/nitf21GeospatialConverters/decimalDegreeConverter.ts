import { BaseProcessor, ProcessorResponse } from 'kyber-server';

export class DecimalDegreeConverter extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                this.executionContext.raw.converter = 'Decimal Degrees';
                this.executionContext.raw.wkt = this.executionContext.getParameterValue('IGEOLO');
                return resolve({
                    successful: true,
                });
            } catch (err) {
                console.error(`DecimalDegreeConverter: ${err}`);
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
