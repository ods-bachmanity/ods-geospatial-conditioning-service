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
            if (!this.executionContext.raw.ods) { this.executionContext.raw.ods = {}; }
            if (!this.executionContext.raw.ods.processors) { this.executionContext.raw.ods.processors  = []; }
            this.executionContext.raw.ods.processors.push(Utilities.getOdsProcessorJSON('success', false));

            // Iterate over all processors store in the array, and add them to the ODS.Processors JSON structure that EMC expects back.
            //
            // Example structure:
            // ODS {
            //     Processors{
            //         <service_name> {
            //             status: "string",
            //             timestamp: "string",
            //             version: "string"
            //         }
            //     }
            // }
            //
            output.ODS = {};
            output.ODS.Processors = {};
            this.executionContext.raw.ods.processors.forEach((item) => {
                const keynames = Object.keys(item);
                keynames.forEach((keyname) => {
                    output.ODS.Processors[keyname] = item[keyname];
                });
            });

            // DEBUG;
            // console.log(`\n\n${JSON.stringify(output.ODS, null, 1)}\n\n`);
            // DEBUG

            resolve({
                data: {GEO: output.GEO, ODS: output.ODS},
                successful: true,
            });
        });

        return result;
    }
}
