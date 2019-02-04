import { BaseProcessor, ProcessorResponse } from 'kyber-server';

export class Nitf21Response extends BaseProcessor {
    public fx(args: any): Promise<ProcessorResponse> {

        const result = new Promise<ProcessorResponse>(async (resolve, reject) => {
            const output: any = Object.assign({}, this.executionContext.raw);
            output.GEO = {};
            output.GEO.WKT = this.executionContext.raw.wkt;
            output.GEO.GeoJSON = this.executionContext.raw.geoJson;
            output.GEO.Countries = this.executionContext.raw.countries;
            resolve({
                data: {GEO: output.GEO},
                successful: true,
            });
        });

        return result;

    }
}
