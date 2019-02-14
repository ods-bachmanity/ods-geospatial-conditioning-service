import { BaseProcessor, ProcessorResponse } from 'kyber-server';
import { DecimalDegreeConverter,
    GeographicCoordsConverter,
    UTMMGRSCoordsConverter,
    UTMNorthCoordsConverter,
    UTMSouthCoordsConverter } from './nitf21GeospatialConverters';

export class Nitf21ICoordsDecisionTree extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise(async (resolve, reject) => {

            try {
                const icords = this.executionContext.getParameterValue('ICORDS');
                this.executionContext.raw = Object.assign({}, {
                    icords,
                    igeolo: this.executionContext.getParameterValue('IGEOLO'),
                });
                switch (icords) {
                    case 'D':
                        const decimalDegreeConverter = new DecimalDegreeConverter(this.executionContext, this.processorDef);
                        await decimalDegreeConverter.fx(args);
                        return resolve({
                            successful: true,
                        });
                    case 'G':
                        const geographicCoordsConverter = new GeographicCoordsConverter(this.executionContext, this.processorDef);
                        await geographicCoordsConverter.fx(args);
                        return resolve({
                            successful: true,
                        });
                    case 'U':
                        const utmmgrsCoordConverter = new UTMMGRSCoordsConverter(this.executionContext, this.processorDef);
                        await utmmgrsCoordConverter.fx(args);
                        return resolve({
                            successful: true,
                        });
                    case 'N':
                        const utmNorthCoordConverter = new UTMNorthCoordsConverter(this.executionContext, this.processorDef);
                        await utmNorthCoordConverter.fx(args);
                        return resolve({
                            successful: true,
                        });
                    case 'S':
                        const utmSouthCoordConverter = new UTMSouthCoordsConverter(this.executionContext, this.processorDef);
                        await utmSouthCoordConverter.fx(args);
                        return resolve({
                            successful: true,
                        });
                    default:
                        return reject({
                            httpStatus: 400,
                            message: `Invalid ICORDS Value Detected: ${icords}`,
                            successful: false,
                        });
                }
            } catch (err) {
                console.error(`Nitf21ICoordsDecisionTree: ${err}`);
                return reject(err.httpStatus ? err : {
                    httpStatus: 500,
                    message: `${err}`,
                    successful: false,
                });
            }
        });

        return result;

    }
}
