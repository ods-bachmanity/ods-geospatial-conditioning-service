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
const kyber_server_1 = require("kyber-server");
const common_1 = require("./common");
const schematics_1 = require("./schematics");
const kyber = new kyber_server_1.KyberServer({
    port: config.port,
});
const logger = new common_1.Logger();
kyber.registerGlobalSchematic(schematics_1.GeospatialConditioningServiceSchematic, []);
kyber.events.on(kyber_server_1.KyberServerEvents.ServerStopping, () => {
    console.log(`\nServer Stopping...`);
});
kyber.registerRoute({
    path: '/v2/ods/geospatialconditioning/health',
    schematic: schematics_1.HealthCheckGetSchematic,
    sharedResources: [],
    verb: 'GET',
});
kyber.registerRoute({
    path: '/v2/ods/geospatialconditioning/nitf21',
    schematic: schematics_1.PostNitf21Schematic,
    sharedResources: [],
    verb: 'POST',
});
function startup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Starting Application Server`);
            console.log(`Initializing Logging Interface`);
            logger.connect(kyber);
            console.log(`Starting up Kyber Server`);
            kyber.start();
        }
        catch (err) {
            console.error(`ERROR STARTING APPLICATION: ${err}`);
            process.exit(1);
        }
    });
}
startup();
