"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const kyber_server_1 = require("kyber-server");
const { combine, timestamp, label, printf } = winston.format;
const path = require('path');
const fs = require('fs');
const myFormat = printf(info => {
    if (info.message && typeof info.message === 'object') {
        info.message = JSON.stringify(info.message);
    }
    return JSON.stringify({
        timestamp: info.timestamp,
        correlationId: info.correlationId,
        level: info.level,
        source: info.source,
        message: info.message
    });
});
const consoleFormat = printf(info => {
    if (info.message && typeof info.message === 'object') {
        info.message = JSON.stringify(info.message);
    }
    return JSON.stringify({
        timestamp: info.timestamp,
        correlationId: info.correlationId,
        level: info.level,
        source: info.source,
        message: info.message
    });
});
class Logger {
    constructor() {
        this._winstonLogger = null;
        this._winstonLogger = winston.createLogger({
            level: 'info',
            format: myFormat,
            transports: [
                new winston.transports.File({ filename: this.getDirectory('error'), level: 'error' }),
                new winston.transports.File({ filename: this.getDirectory('combined') })
            ]
        });
        if (process.env.NODE_ENV !== 'production') {
            this._winstonLogger.add(new winston.transports.Console({
                format: consoleFormat
            }));
        }
    }
    connect(kyber) {
        kyber.events.on(kyber_server_1.KyberServerEvents.ServerStarted, (args) => {
            this.info(args.correlationId, args, args.source);
        });
        kyber.events.on(kyber_server_1.KyberServerEvents.ProcessorStarted, (args) => {
            this.info(args.correlationId, args, args.source);
        });
        kyber.events.on(kyber_server_1.KyberServerEvents.ProcessorEnded, (args) => {
            this.info(args.correlationId, args, args.source);
        });
        kyber.events.on(kyber_server_1.KyberServerEvents.ActivityStarted, (args) => {
            this.info(args.correlationId, args, args.source);
        });
        kyber.events.on(kyber_server_1.KyberServerEvents.ActivityEnded, (args) => {
            this.info(args.correlationId, args, args.source);
        });
        kyber.events.on(kyber_server_1.KyberServerEvents.GlobalSchematicError, (args) => {
            this.error(args.correlationId, args, args.source);
        });
        kyber.events.on(kyber_server_1.KyberServerEvents.BeginRequest, (args) => {
            this.info(args.correlationId, args, args.source);
        });
        kyber.events.on(kyber_server_1.KyberServerEvents.RouteHandlerException, (args) => {
            this.error(args.correlationId, args, args.source);
        });
        kyber.events.on(kyber_server_1.KyberServerEvents.ExecutionContextAfterLoadParameters, (args) => {
            this.info(args.correlationId, args, args.source);
        });
        kyber.events.on(kyber_server_1.KyberServerEvents.EndRequest, (args) => {
            this.info(args.correlationId, args, args.source);
        });
        kyber.events.on(kyber_server_1.KyberServerEvents.ServerStopping, (args) => {
            this.info(args.correlationId, args, args.source);
        });
    }
    log(id, message, source) {
        this._winstonLogger.info(this.logPayload(id, message, source));
    }
    info(id, message, source) {
        this._winstonLogger.info(this.logPayload(id, message, source));
    }
    error(id, message, source) {
        this._winstonLogger.error(this.logPayload(id, message, source));
    }
    warn(id, message, source) {
        this._winstonLogger.warn(this.logPayload(id, message, source));
    }
    logPayload(id, message, source) {
        return {
            message: message,
            source: source,
            correlationId: id,
            timestamp: new Date().toISOString()
        };
    }
    getDirectory(directorySubType) {
        const theDate = new Date();
        const targetFileName = `${theDate.getUTCDate()}-${this.getMonthName(theDate.getUTCMonth())}-${theDate.getUTCFullYear()}-${directorySubType}.log`;
        this.verifyTargetDirectory(path.join(process.cwd(), 'logs'));
        const targetPath = path.join(process.cwd(), 'logs', targetFileName);
        return targetPath;
    }
    verifyTargetDirectory(endpoint) {
        if (!fs.existsSync(endpoint)) {
            console.log(`Creating Logging Directory at: ${endpoint}`);
            fs.mkdirSync(endpoint);
        }
    }
    getMonthName(month) {
        switch (month) {
            case 0:
                return 'JAN';
            case 1:
                return 'FEB';
            case 2:
                return 'MAR';
            case 3:
                return 'APR';
            case 4:
                return 'MAY';
            case 5:
                return 'JUN';
            case 6:
                return 'JUL';
            case 7:
                return 'AUG';
            case 8:
                return 'SEP';
            case 9:
                return 'OCT';
            case 10:
                return 'NOV';
            case 11:
                return 'DEC';
            default:
                return 'UNK';
        }
    }
}
exports.Logger = Logger;
