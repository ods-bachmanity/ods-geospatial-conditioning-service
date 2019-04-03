import * as config from 'config';
import { SyberServer, SyberServerEvents } from 'syber-server';
import { Logger } from './common';
import { GeospatialConditioningServiceSchematic, HealthCheckGetSchematic, PostNitf21Schematic } from './schematics';

const logger = new Logger();

// Stand up Express Server Common Framework
const syber = new SyberServer({
    port: config.port,
    logger,
});

// register a global schematic to handle errors, run before each execution, run after each execution, startup and shutdown
syber.registerGlobalSchematic(
    GeospatialConditioningServiceSchematic,
    [],
);

// Handle Shutdown Event gracefully. Close database connection
syber.events.on(SyberServerEvents.ServerStopping, () => {
    logger.log(`SYS`, `\nServer Stopping...`, `index.onServerStopping`);
    // Nothing to do here
});

// GET /v2/ods/geospatialconversion/health
syber.registerRoute({
    path: '/v2/ods/geospatialconditioning/health',
    schematic: HealthCheckGetSchematic,
    sharedResources: [],
    verb: 'GET',
});

// POST /v2/ods/geospatialconversion/convert
syber.registerRoute({
    path: '/v2/ods/geospatialconditioning/nitf21',
    schematic: PostNitf21Schematic,
    sharedResources: [],
    verb: 'POST',
});

// Helper method to handle initialization and precondition check on database connection
// Note: We do not call syber.start() until after all routes are registered and all shared resources are verified/seeded etc.
async function startup() {
    try {
        logger.log(`SYS`, `Starting Application Server`, `index.startup`);
        logger.log(`SYS`, `Initializing Logging Interface`, `index.startup`);
        logger.connect(syber);
        logger.log(`SYS`, `Starting up Syber Server`, `index.startup`);
        syber.start();
    } catch (err) {
        logger.error(`SYS`, `ERROR STARTING APPLICATION: ${err}`, `index.startup`);
        process.exit(1);
    }
}

// Start the Server
startup();
