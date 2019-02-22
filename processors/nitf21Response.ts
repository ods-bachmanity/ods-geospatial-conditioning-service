import { BaseProcessor, ProcessorResponse } from 'kyber-server';

export class Nitf21Response extends BaseProcessor {
    public fx(args: any): Promise<ProcessorResponse> {

        const result = new Promise<ProcessorResponse>(async (resolve, reject) => {
            const output: any = Object.assign({}, this.executionContext.raw);
            const CountryOutput: Array<string> = [];
            output.GEO = {};
            output.GEO.WKT = this.executionContext.raw.wkt;
            output.GEO.GeoJSON = this.executionContext.raw.geoJson;
            // Populate the CountryOutput array with just the GENC_3 values returned from CountryCode service
            this.executionContext.raw.countries.forEach((x: { GENC_3: string; }) => CountryOutput.push(x.GENC_3));
            output.GEO.CountryCodes = CountryOutput;

            resolve({
                data: {GEO: output.GEO},
                successful: true,
            });
        });

        return result;
    }
}
