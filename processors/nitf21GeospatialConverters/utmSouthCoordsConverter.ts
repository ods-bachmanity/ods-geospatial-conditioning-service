import { BaseProcessor, ProcessorResponse } from 'kyber-server'

export class UTMSouthCoordsConverter extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {
        
        const result: Promise<ProcessorResponse> = new Promise(async(resolve, reject) => {
            
            try {
                this.executionContext.raw.converter = 'UTM South Coords'
                return resolve({
                    successful: true
                })
            }
            catch (err) {
                console.error(`UTMSouthCoordsConverter: ${err}`)
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
