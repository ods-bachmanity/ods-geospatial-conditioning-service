"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const syber_server_1 = require("syber-server");
const common_1 = require("./common");
const schematics_1 = require("./schematics");
const logger = new common_1.Logger();
const syber = new syber_server_1.SyberServer({
    port: config.port,
    logger,
});
const httpLogger = new common_1.HttpLogger(syber.express, logger);
httpLogger.init();
syber.registerGlobalSchematic(schematics_1.GeospatialConditioningServiceSchematic, []);
syber.events.on(syber_server_1.SyberServerEvents.ServerStopping, () => {
    logger.log(`SYS`, `\nServer Stopping...`, `index.onServerStopping`);
    httpLogger.destroy();
});
syber.registerRoute({
    path: '/v2/ods/geospatialconditioning/health',
    schematic: schematics_1.HealthCheckGetSchematic,
    sharedResources: [],
    verb: 'GET',
});
syber.registerRoute({
    path: '/v2/ods/geospatialconditioning/nitf21',
    schematic: schematics_1.PostNitf21Schematic,
    sharedResources: [],
    verb: 'POST',
});
function startup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger.log(`SYS`, `Starting Application Server`, `index.startup`);
            logger.log(`SYS`, `Initializing Logging Interface`, `index.startup`);
            logger.connect(syber);
            logger.log(`SYS`, `Starting up Syber Server`, `index.startup`);
            syber.start();
        }
        catch (err) {
            logger.error(`SYS`, `ERROR STARTING APPLICATION: ${err}`, `index.startup`);
            process.exit(1);
        }
    });
}
startup();
