import { BaseProcessor, ProcessorResponse } from 'kyber-server';

export class UTMNorthCoordsConverter extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                this.executionContext.raw.converter = 'UTM North Coords';
                return resolve({
                    successful: true,
                });
            } catch (err) {
                console.error(`UTMNorthCoordsConverter: ${err}`);
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
