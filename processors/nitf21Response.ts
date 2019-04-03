import { BaseProcessor, ProcessorResponse, ProcessorErrorResponse } from 'syber-server';
import { Utilities } from '../common';

export class Nitf21Response extends BaseProcessor {

    public fx(): Promise<ProcessorResponse|ProcessorErrorResponse> {

        const result = new Promise<ProcessorResponse|ProcessorErrorResponse>(async (resolve, reject) => {
            const output: any = {};
            const countryOutput: Array<string> = [];
            output.GEO = {};
            output.GEO.WKT = this.executionContext.document.wkt;
            output.GEO.GeoJSON = this.executionContext.document.geoJson;
            output.GEO.MBR = this.executionContext.document.mbr;

            // Populate the CountryOutput array with just the GENC_3 values returned from CountryCode service
            this.executionContext.document.countries.forEach((x: { GENC_3: string; }) => countryOutput.push(x.GENC_3));
            output.GEO.CountryCodes = countryOutput;

            // Add ODS.Processor.<servicename> return JSON to the processors array in raw.
            output.ODS = this.executionContext.document.ODS || {};
            output.ODS.Processors = Object.assign({}, this.executionContext.document.ODS.Processors, Utilities.getOdsProcessorJSON());

            resolve({
                data: {GEO: output.GEO, ODS: output.ODS},
                successful: true,
            });
        });

        return result;
    }
}
