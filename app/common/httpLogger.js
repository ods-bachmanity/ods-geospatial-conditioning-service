"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
morgan.token('id', function getId(req) {
    return req.id;
});
class HttpLogger {
    constructor(expressApp, applicationLogger) {
        this.expressApp = expressApp;
        this.applicationLogger = applicationLogger;
        this.formatString = `:id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms`;
        this.accessLogStream = null;
    }
    init() {
        try {
            const filepath = this.getLogFilePath();
            this.accessLogStream = fs.createWriteStream(filepath, { flags: 'a' });
            this.expressApp.use(morgan(this.formatString, { stream: this.accessLogStream }));
        }
        catch (err) {
            this.applicationLogger.error(`SYS`, err.message, `HttpLogger.init`);
        }
    }
    destroy() {
        if (this.accessLogStream) {
            try {
                this.accessLogStream.end();
                return true;
            }
            catch (err) {
                this.applicationLogger.error(`SYS`, err.message, `HttpLogger`);
                return false;
            }
        }
    }
    getLogFilePath() {
        const desiredLogPath = `/var/log/gcs/http`;
        try {
            if (!fs.existsSync(desiredLogPath)) {
                return path.join(process.cwd(), 'http.log');
            }
            if (!fs.existsSync(path.join(desiredLogPath, 'http.log'))) {
                fs.writeFileSync(path.join(desiredLogPath, 'http.log'), '');
            }
            return path.join(desiredLogPath, `http.log`);
        }
        catch (err) {
            this.applicationLogger.error(`SYS`, err.message, `HttpLogger.getLogFilePath`);
            return path.join(process.cwd(), 'http.log');
        }
    }
}
exports.HttpLogger = HttpLogger;
