import { BaseProcessor, ProcessorResponse } from 'kyber-server';

export class UTMNorthCoordsConverter extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                this.executionContext.raw.converter = 'UTM North Cords';
                return resolve({
                    successful: true,
                });
            } catch (err) {
                console.error(`UTMNorthCordsConverter: ${err}`);
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
