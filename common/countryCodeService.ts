import * as rp from 'request-promise';
import { Logger } from './logger';

export class CountryCodeService {

    private servicePath: string = process.env.COUNTRYCODESERVICEURL;
    private logger: Logger = new Logger();

    public constructor(private correlationId: string) {}

    public get(wktInput: string): Promise<any> {

        const result: Promise<any> = new Promise(async (resolve, reject) => {

            try {
                if (!this.servicePath) {
                    this.logger.error(this.correlationId, `Invalid Service Path for Country Code Service`, `COUNTRYCODESERVICE.GET`);
                    return reject({message: `Invalid Service Path for Country Code Service`});
                }

                if (!wktInput) {
                    this.logger.log(this.correlationId, `Attempt to retrieve country code list for empty wkt string`, `COUNTRYCODESERVICE.GET`);
                    return resolve(undefined);
                }

                const response = await rp.post({
                    body: JSON.stringify({
                        wkt: wktInput,
                    }),
                    headers: { 'content-type': 'application/json' },
                    url: this.servicePath,
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

}
