import { BaseProcessor, ProcessorResponse } from 'kyber-server'

export class UTMMGRSCoordsConverter extends BaseProcessor {

    public fx(args: any): Promise<ProcessorResponse> {
        
        const result: Promise<ProcessorResponse> = new Promise(async(resolve, reject) => {
            
            try {
                this.executionContext.raw.converter = 'UTM MGRS Coords'
                return resolve({
                    successful: true
                })
            }
            catch (err) {
                console.error(`UTMMGRSCoordsConverter: ${err}`)
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
