import { BaseProcessor, ProcessorResponse, ProcessorErrorResponse } from 'syber-server';

export class ErrorResponse extends BaseProcessor {

    public fx(): Promise<ProcessorResponse|ProcessorErrorResponse> {

        const result: Promise<ProcessorResponse|ProcessorErrorResponse> = new Promise((resolve, reject) => {
            try {
                let message = `Error in Geospatial Conditioning Service`;
                if (this.executionContext.httpStatus === 404) {
                    message = `Unable to locate path '${this.executionContext.req.path}'`;
                }
                if (this.executionContext.document && typeof this.executionContext.document === 'string') {
                    message = this.executionContext.document;
                }

                return resolve({
                    data: {
                        code: -1,
                        comment: this.processorDef.args ? this.processorDef.args : undefined, // using undefined will prevent the element from being included if args is null
                        correlationId: this.executionContext.correlationId,
                        errors: this.executionContext.errors,
                        message,
                        warnings: this.executionContext.warnings,
                    },
                    httpStatus: this.executionContext.httpStatus,
                    message,
                    successful: false,
                });
            } catch (err) {
                return reject({
                    data: {
                        code: -1,
                        comment: this.processorDef.args ? this.processorDef.args : undefined,
                        correlationId: this.executionContext.correlationId,
                        errors: this.executionContext.errors,
                        message: `Error in Geospatial Conversion Service`,
                        warnings: this.executionContext.warnings,
                    },
                    httpStatus: 500,
                    message: `Error in Error Response`,
                    successful: false,
                });
            }
        });

        return result;

    }

}
