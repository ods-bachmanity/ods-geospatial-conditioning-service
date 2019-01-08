import {KyberServer, KyberServerEvents } from 'kyber-server'
import * as config from 'config'
import { HealthCheckGetSchematic, GeospatialConditioningServiceSchematic, PostNitf21Schematic } from './schematics'
import { Logger } from './common'

// Stand up Express Server Common Framework
const kyber = new KyberServer({
    port: config.port
})

// declare an instance of the oracle database to be shared with schematics
const logger = new Logger()

// register a global schematic to handle errors, run before each execution, run after each execution, startup and shutdown
kyber.registerGlobalSchematic(
    GeospatialConditioningServiceSchematic,
    []
)

// Handle Shutdown Event gracefully. Close database connection
kyber.events.on(KyberServerEvents.ServerStopping, () => {
    console.log(`\nServer Stopping...`)
    // Nothing to do here
})
    
// GET /v2/ods/geospatialconversion/health
kyber.registerRoute({
    verb: 'GET',
    path: '/v2/ods/geospatialconditioning/health',
    schematic: HealthCheckGetSchematic,
    sharedResources: []
})

// POST /v2/ods/geospatialconversion/convert
kyber.registerRoute({
    verb: 'POST',
    path: '/v2/ods/geospatialconditioning/nitf21',
    schematic: PostNitf21Schematic,
    sharedResources: []
})

// Helper method to handle initialization and precondition check on database connection
// Note: We do not call kyber.start() until after all routes are registered and all shared resources are verified/seeded etc.
async function startup() {
    try {
        console.log(`Starting Application Server`)
        console.log(`Initializing Logging Interface`)
        logger.connect(kyber)
        console.log(`Starting up Kyber Server`)
        kyber.start()
    }
    catch (err) {
        console.error(`ERROR STARTING APPLICATION: ${err}`)
        process.exit(1)
    }
}

// Start the Server
startup()

