import { BaseProcessor, ProcessorResponse } from 'kyber-server';
import { Utilities } from '../common';

export class Nitf21Response extends BaseProcessor {
    public fx(args: any): Promise<ProcessorResponse> {

        const result = new Promise<ProcessorResponse>(async (resolve, reject) => {
            const output: any = {};
            const countryOutput: Array<string> = [];
            output.GEO = {};
            output.GEO.WKT = this.executionContext.raw.wkt;
            output.GEO.GeoJSON = this.executionContext.raw.geoJson;
            output.GEO.MBR = this.executionContext.raw.mbr;

            // Populate the CountryOutput array with just the GENC_3 values returned from CountryCode service
            this.executionContext.raw.countries.forEach((x: { GENC_3: string; }) => countryOutput.push(x.GENC_3));
            output.GEO.CountryCodes = countryOutput;

            // Add ODS.Processor.<servicename> return JSON to the processors array in raw.
            output.ODS = this.executionContext.raw.ODS || {};
            output.ODS.Processors = Object.assign({}, this.executionContext.raw.ODS.Processors, Utilities.getOdsProcessorJSON());

            resolve({
                data: {GEO: output.GEO, ODS: output.ODS},
                successful: true,
            });
        });

        return result;
    }
}
