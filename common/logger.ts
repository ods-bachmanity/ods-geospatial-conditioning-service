import * as fs from 'fs'; // const fs = require('fs');
import * as path from 'path'; // const path = require('path');
import * as winston from 'winston';
const { combine, timestamp, label, printf } = winston.format;
import { KyberServer, KyberServerEvents } from 'kyber-server';

const myFormat = printf((info) => {

    if (info.message && typeof info.message === 'object') {
        info.message = JSON.stringify(info.message);
    }
    return JSON.stringify({
        correlationId: info.correlationId,
        level: info.level,
        message: info.message,
        source: info.source,
        timestamp: info.timestamp,
    });

});

const consoleFormat = printf((info) => {
    if (info.message && typeof info.message === 'object') {
        info.message = JSON.stringify(info.message);
    }

    return JSON.stringify({
        correlationId: info.correlationId,
        level: info.level,
        message: info.message,
        source: info.source,
        timestamp: info.timestamp,
    });
});

export class Logger {

    private winstonLogger?: winston.Logger = null;
    constructor() {

        /*
            Log to local filesystem
            transports: [
              new winston.transports.File({ filename: this.getDirectory('error'), level: 'error' }),
              new winston.transports.File({ filename: this.getDirectory('combined') }),
            ],

        */
        this.winstonLogger = winston.createLogger({
            format: myFormat,
            level: 'info',
            transports: [],
        });
        //
        // If we're not in production then log to the `console` with the format:
        // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
        //
        if (process.env.NODE_ENV !== 'production') {
            this.winstonLogger.add(new winston.transports.Console({
                format: consoleFormat,
            }));
        }
    }

    public connect(kyber: KyberServer) {

        // #region Event Handlers
        kyber.events.on(KyberServerEvents.ServerStarted, (args) => {
            this.info(args.correlationId, args, args.source);
        });

        kyber.events.on(KyberServerEvents.ProcessorStarted, (args) => {
            this.info(args.correlationId, args, args.source);
        });

        kyber.events.on(KyberServerEvents.ProcessorEnded, (args) => {
            this.info(args.correlationId, args, args.source);
        });

        kyber.events.on(KyberServerEvents.ActivityStarted, (args) => {
            this.info(args.correlationId, args, args.source);
        });

        kyber.events.on(KyberServerEvents.ActivityEnded, (args) => {
            this.info(args.correlationId, args, args.source);
        });

        kyber.events.on(KyberServerEvents.GlobalSchematicError, (args) => {
            this.error(args.correlationId, args, args.source);
        });

        kyber.events.on(KyberServerEvents.BeginRequest, (args) => {
            this.info(args.correlationId, args, args.source);
        });

        kyber.events.on(KyberServerEvents.RouteHandlerException, (args) => {
            this.error(args.correlationId, args, args.source);
        });

        kyber.events.on(KyberServerEvents.ExecutionContextAfterLoadParameters, (args) => {
            this.info(args.correlationId, args, args.source);
        });

        kyber.events.on(KyberServerEvents.EndRequest, (args) => {
            this.info(args.correlationId, args, args.source);
        });

        kyber.events.on(KyberServerEvents.ServerStopping, (args) => {
            this.info(args.correlationId, args, args.source);
        });
        // #endregion
    }

    public log(id: string, message: string, source: string) {
        this.winstonLogger.info(this.logPayload(id, message, source));
    }
    public info(id: string, message: string, source: string) {
        this.winstonLogger.info(this.logPayload(id, message, source));
    }
    public error(id: string, message: string, source: string) {
        this.winstonLogger.error(this.logPayload(id, message, source));
    }
    public warn(id: string, message: string, source: string) {
        this.winstonLogger.warn(this.logPayload(id, message, source));
    }

    private logPayload(id: string, message: string, source: string): any {
        return {
            correlationId: id,
            message,
            source,
            timestamp: new Date().toISOString(),
        };
    }

    private getDirectory(directorySubType: string): string {

        const theDate = new Date();
        const targetFileName = `${theDate.getUTCDate()}-${this.getMonthName(theDate.getUTCMonth())}-${theDate.getUTCFullYear()}-${directorySubType}.log`;
        // Make sure logs directory exists
        this.verifyTargetDirectory(path.join(process.cwd(), 'logs'));

        const targetPath = path.join(process.cwd(), 'logs', targetFileName);

        return targetPath;

    }

    private verifyTargetDirectory(endpoint: string) {

        if (!fs.existsSync(endpoint)) {
            console.log(`Creating Logging Directory at: ${endpoint}`);
            fs.mkdirSync(endpoint);
        }

    }

    private getMonthName(month: number): string {
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
