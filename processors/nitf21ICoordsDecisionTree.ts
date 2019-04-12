import { BaseProcessor, ProcessorResponse, ProcessorErrorResponse, ExecutionContext, ProcessorDef } from 'syber-server';
import { DecimalDegreeConverter,
    GeographicCoordsConverter,
    UTMMGRSCoordsConverter,
    UTMNorthCoordsConverter,
    UTMSouthCoordsConverter } from './nitf21GeospatialConverters';

export class Nitf21ICoordsDecisionTree extends BaseProcessor {

    public fx(): Promise<ProcessorResponse|ProcessorErrorResponse> {

        const result: Promise<ProcessorResponse|ProcessorErrorResponse> = new Promise(async (resolve, reject) => {

            try {
                const icords = this.executionContext.getParameterValue('ICORDS');
                this.executionContext.document = Object.assign({}, {
                    icords,
                    igeolo: this.executionContext.getParameterValue('IGEOLO'),
                });
                let response: ProcessorResponse;
                switch (icords) {
                    case 'D':
                        const decimalDegreeConverter = new DecimalDegreeConverter(this.executionContext, this.processorDef, this.logger);
                        response = await decimalDegreeConverter.fx();
                        return resolve(response);
                    case 'G':
                        const geographicCoordsConverter = new GeographicCoordsConverter(this.executionContext, this.processorDef, this.logger);
                        response = await geographicCoordsConverter.fx();
                        return resolve(response);
                    case 'U':
                        const utmmgrsCoordConverter = new UTMMGRSCoordsConverter(this.executionContext, this.processorDef, this.logger);
                        response = await utmmgrsCoordConverter.fx();
                        return resolve(response);
                    case 'N':
                        const utmNorthCoordConverter = new UTMNorthCoordsConverter(this.executionContext, this.processorDef, this.logger);
                        response = await utmNorthCoordConverter.fx();
                        return resolve(response);
                    case 'S':
                        const utmSouthCoordConverter = new UTMSouthCoordsConverter(this.executionContext, this.processorDef, this.logger);
                        response = await utmSouthCoordConverter.fx();
                        return resolve(response);
                    default:
                        return reject(this.handleError({message: `Invalid ICORDS Value Detected: ${icords}`}, `nitf21ICoordsDecisionTree.fx`, 400));
                }
            } catch (err) {
                return reject(this.handleError(err, `nitf21ICoordsDecisionTree.fx`, 500));
            }
        });

        return result;

    }
}
