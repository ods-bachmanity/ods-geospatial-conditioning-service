import * as config from 'config';
import { KyberServer, KyberServerEvents } from 'kyber-server';
import { Logger } from './common';
import { GeospatialConditioningServiceSchematic, HealthCheckGetSchematic, PostNitf21Schematic } from './schematics';

// Stand up Express Server Common Framework
const kyber = new KyberServer({
    port: config.port,
});

const logger = new Logger();

// register a global schematic to handle errors, run before each execution, run after each execution, startup and shutdown
kyber.registerGlobalSchematic(
    GeospatialConditioningServiceSchematic,
    [],
);

// Handle Shutdown Event gracefully. Close database connection
kyber.events.on(KyberServerEvents.ServerStopping, () => {
    console.log(`\nServer Stopping...`);
    // Nothing to do here
});

// GET /v2/ods/geospatialconversion/health
kyber.registerRoute({
    path: '/v2/ods/geospatialconditioning/health',
    schematic: HealthCheckGetSchematic,
    sharedResources: [],
    verb: 'GET',
});

// POST /v2/ods/geospatialconversion/convert
kyber.registerRoute({
    path: '/v2/ods/geospatialconditioning/nitf21',
    schematic: PostNitf21Schematic,
    sharedResources: [],
    verb: 'POST',
});

// Helper method to handle initialization and precondition check on database connection
// Note: We do not call kyber.start() until after all routes are registered and all shared resources are verified/seeded etc.
async function startup() {
    try {
        console.log(`Starting Application Server`);
        console.log(`Initializing Logging Interface`);
        logger.connect(kyber);
        console.log(`Starting up Kyber Server`);
        kyber.start();
    } catch (err) {
        console.error(`ERROR STARTING APPLICATION: ${err}`);
        process.exit(1);
    }
}

// Start the Server
startup();
