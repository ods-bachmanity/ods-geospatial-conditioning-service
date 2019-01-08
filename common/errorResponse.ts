import { BaseProcessor, ProcessorResponse } from 'kyber-server';

export class ErrorResponse extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {

        const result: Promise<ProcessorResponse> = new Promise((resolve, reject) => {
            try {
                let message = `Error in Geospatial Conversion Service`;
                if (this.executionContext.httpStatus === 404) {
                    message = `Unable to locate path '${this.executionContext.req.path}'`;
                }
                if (this.executionContext.raw && typeof this.executionContext.raw === 'string') {
                    message = this.executionContext.raw;
                }

                return resolve({
                    data: {
                        code: -1,
                        comment: args ? args : undefined, // using undefined will prevent the element from being included if args is null
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
                        comment: args ? args : undefined,
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
