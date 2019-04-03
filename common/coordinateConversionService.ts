import * as rp from 'request-promise';
import { ILogger } from 'syber-server';

export class CoordinateConversionService {

    private servicePath: string = process.env.COORDCONVERSIONSERVICE_BASEURL;
    private healthEndpoint: string = process.env.COORDCONVERSIONSERVICE_HEALTHENDPOINT;
    private conversionEndpoint: string = process.env.COORDCONVERSIONSERVICE_CONVERSIONENDPOINT;

    public constructor(private correlationId: string, private logger: ILogger ) {}

    public get(requestBody: any): Promise<any> {

        const result: Promise<any> = new Promise(async (resolve, reject) => {

            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Coordinate Conversion Service`, `COORDINATECONVERSIONSERVICE.GET`);
                    return reject(`Invalid Service Path for Coordinate Conversion Service, update environment value for COORDCONVERSIONSERVICE_BASEURL`);
                }
                if (!this.conversionEndpoint) {
                    this.logger.error(this.correlationId, `Invalid conversion endpoint for Coordinate Conversion Service`, `COORDINATECONVERSIONSERVICE.GET`);
                    return reject({message: `Invalid conversion endpoint for Coordinate Conversion Service, update environment value for COORDCONVERSIONSERVICE_CONVERSIONENDPOINT`});
                }

                if (!requestBody) {
                    this.logger.warn(this.correlationId, `Invalid Request body in Coordinate Conversion Service Call`, `COORDINATECONVERSIONSERVICE.GET`);
                    return resolve(undefined);
                }

                const response = await rp.post({
                    body: JSON.stringify(requestBody),
                    headers: { 'content-type': 'application/json' },
                    url: this.servicePath + this.conversionEndpoint,
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

    public getHealth(): Promise<any> {
        const result: Promise<any> = new Promise(async (resolve, reject) => {
            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Coordinate Conversion Service`, `COORDINATECONVERSIONSERVICE.GETHEALTH`);
                    return reject({message: `Invalid Service Path for Coordinate Conversion Service, update environment value for COORDCONVERSIONSERVICE_BASEURL`});
                }
                if (!this.healthEndpoint) {
                    this.logger.error(this.correlationId, `Invalid health endpoint for Coordinate Conversion Service`, `COORDINATECONVERSIONSERVICE.GETHEALTH`);
                    return reject({message: `Invalid health endpoint for Coordinate Conversion Service, update environment value for COORDCONVERSIONSERVICE_HEALTHENDPOINT`});
                }

                const response = await rp.get({
                    url: this.servicePath + this.healthEndpoint,
                });

                const body = JSON.parse(response);
                body.healthy = true;
                return resolve(body);

            } catch (err) {
                this.logger.warn(this.correlationId, `Warning, cannot reach Coordinate Conversion Service: ${err.message}`, `COORDINATECONVERSIONSERVICE.GETHEALTH`);
                return resolve(err);
            }
        });

        return result;
    }
}
