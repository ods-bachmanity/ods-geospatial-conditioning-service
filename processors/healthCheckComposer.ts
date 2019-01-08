import { BaseProcessor, ProcessorResponse } from 'kyber-server'

export class HealthCheckComposer extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {
        
        const result: Promise<ProcessorResponse> = new Promise(async(resolve, reject) => {
            
            try {
                this.executionContext.raw = Object.assign({}, {
                    HealthCheck: `OK`,
                    Message: `No Rest for Old Men`
                })
                return resolve({
                    successful: true
                })
            }
            catch (err) {
                console.error(`HealthCheckComposer: ${err}`)
                return reject({
                    successful: false,
                    message: `${err}`,
                    httpStatus: 500
                })
            }
        })

        return result    
    
    }
}
