import { BaseProcessor, ProcessorResponse } from 'kyber-server';

export class Nitf21Response extends BaseProcessor {
    public fx(args: any): Promise<ProcessorResponse> {

        const result = new Promise<ProcessorResponse>(async (resolve, reject) => {
            const output: any = Object.assign({}, this.executionContext.raw);
            resolve({
                data: output,
                successful: true,
            });
        });

        return result;

    }
}
