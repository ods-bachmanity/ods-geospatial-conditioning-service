import { BaseProcessor, ProcessorResponse } from 'kyber-server';

export class GeographicCoordsConverter extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                this.executionContext.raw.converter = 'Geographic Degrees';
                return resolve({
                    successful: true,
                });
            } catch (err) {
                console.error(`GeographicCoordsConverter: ${err}`);
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
