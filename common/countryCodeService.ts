import * as rp from 'request-promise';
import { ILogger } from 'syber-server';

export class CountryCodeService {

    private servicePath: string = process.env.COUNTRYCODESERVICE_BASEURL;
    private healthEndpoint: string = process.env.COUNTRYCODESERVICE_HEALTHENDPOINT;
    private countriesEndpoint: string = process.env.COUNTRYCODESERVICE_COUNTRIESENDPOINT;

    public constructor(private correlationId: string, private logger: ILogger) {}

    public get(wktInput: string): Promise<any> {

        const result: Promise<any> = new Promise(async (resolve, reject) => {

            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Country Code Service`, `COUNTRYCODESERVICE.GET`);
                    return reject({message: `Invalid Service Path for Country Code Service, update environment value for COUNTRYCODESERVICE_BASEURL`});
                }
                if (!this.countriesEndpoint) {
                    this.logger.error(this.correlationId, `Invalid countries endpoint for Country Code Service`, `COUNTRYCODESERVICE.GET`);
                    return reject({message: `Invalid countries endpoint for Country Code Service, update environment value for COUNTRYCODESERVICE_COUNTRIESENDPOINT`});
                }

                if (!wktInput) {
                    this.logger.warn(this.correlationId, `Attempt to retrieve country code list for empty wkt string`, `COUNTRYCODESERVICE.GET`);
                    return resolve(undefined);
                }

                const response = await rp.post({
                    body: JSON.stringify({
                        wkt: wktInput,
                    }),
                    headers: { 'content-type': 'application/json' },
                    url: this.servicePath + this.countriesEndpoint,
                });

                const records = JSON.parse(response);
                return resolve(records);

            } catch (err) {
                this.logger.error(this.correlationId, `Error in Country Code Service: ${err.message}`, `COUNTRYCODESERVICE.GET`);
                return reject(err);
            }

        });

        return result;
    }

    public getHealth(): Promise<any> {
        const result: Promise<any> = new Promise(async (resolve, reject) => {
            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Country Code Service`, `COUNTRYCODESERVICE.GETHEALTH`);
                    return reject({message: `Invalid Service Path for Country Code Service, update environment value for COUNTRYCODESERVICE_BASEURL`});
                }
                if (!this.healthEndpoint) {
                    this.logger.error(this.correlationId, `Invalid health endpoint for Country Code Service`, `COUNTRYCODESERVICE.GETHEALTH`);
                    return reject({message: `Invalid health endpoint for Country Code Service, update environment value for COUNTRYCODESERVICE_HEALTHENDPOINT`});
                }

                const response = await rp.get({
                    url: this.servicePath + this.healthEndpoint,
                });

                const body = JSON.parse(response);
                body.healthy = true;
                return resolve(body);

            } catch (err) {
                this.logger.error(this.correlationId, `Warning, cannot reach Country Code Service: ${err.message}`, `COUNTRYCODESERVICE.GETHEALTH`);
                return resolve(err);
            }
        });

        return result;
    }

}
