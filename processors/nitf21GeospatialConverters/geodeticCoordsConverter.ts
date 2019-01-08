import { BaseProcessor, ProcessorResponse } from 'kyber-server'

export class GeodeticCoordsConverter extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {
        
        const result: Promise<ProcessorResponse> = new Promise(async(resolve, reject) => {
            
            try {
                this.executionContext.raw.converter = 'Geodetic Degrees'
                return resolve({
                    successful: true
                })
            }
            catch (err) {
                console.error(`GeodeticCoordsConverter: ${err}`)
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
