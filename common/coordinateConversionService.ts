import * as rp from 'request-promise';
import { Logger } from './logger';

export class CoordinateConversionService {

    private servicePath: string = process.env.COORDCONVERSIONSERVICEURL;
    private logger: Logger = new Logger();

    public constructor(private correlationId: string) {}

    public get(requestBody: any): Promise<any> {

        const result: Promise<any> = new Promise(async (resolve, reject) => {

            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Coordinate Conversion Service`, `COORDINATECONVERSIONSERVICE.GET`);
                    return reject(`Invalid Service Path for Coordinate Conversion Service`);
                }

                if (!requestBody) {
                    this.logger.log(this.correlationId, `Invalid Request body in Coordinate Conversion Service Call`, `COORDINATECONVERSIONSERVICE.GET`);
                    return resolve(undefined);
                }

                const response = await rp.post({
                    body: JSON.stringify(requestBody),
                    headers: { 'content-type': 'application/json' },
                    url: this.servicePath,
                });

                const records = JSON.parse(response);
                return resolve(records);

            } catch (err) {
                this.logger.error(this.correlationId, `Error in Coordinate Conversion Service: ${err.message}`, `COORDINATECONVERSIONSERVICE.GET`);
                return reject(err);
            }

        });

        return result;
    }
}
