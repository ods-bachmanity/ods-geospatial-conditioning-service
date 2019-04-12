import * as fs from 'fs';
import * as morgan from 'morgan';
import * as path from 'path';
import { ILogger } from 'syber-server';

morgan.token('id', function getId(req) {
    return req.id;
});

export class HttpLogger {

    private formatString = `:id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms`;
    private accessLogStream = null;

    constructor(private expressApp: any, private applicationLogger: ILogger) {}

    public init() {
        try {
            const filepath = this.getLogFilePath();
            this.accessLogStream = fs.createWriteStream(filepath, { flags: 'a' });
            this.expressApp.use(morgan(this.formatString, { stream: this.accessLogStream }));
        } catch (err) {
            this.applicationLogger.error(`SYS`, err.message, `HttpLogger.init`);
        }
    }

    public destroy() {
        if (this.accessLogStream) {
            try {
                this.accessLogStream.end();
                return true;
            } catch (err) {
                this.applicationLogger.error(`SYS`, err.message, `HttpLogger`);
                return false;
            }
        }
    }

    private getLogFilePath() {
        const desiredLogPath = `/var/log/gcs/http`;
        try {
            if (!fs.existsSync(desiredLogPath)) {
                // Windows
                return path.join(process.cwd(), 'http.log');
            }
            if (!fs.existsSync(path.join(desiredLogPath, 'http.log'))) {
                // tslint:disable-next-line:no-bitwise
                // const mode777 = parseInt('0777', 8) & ~process.umask();
                fs.writeFileSync(path.join(desiredLogPath, 'http.log'), '');
            }
            return path.join(desiredLogPath, `http.log`);
        } catch (err) {
            this.applicationLogger.error(`SYS`, err.message, `HttpLogger.getLogFilePath`);
            return path.join(process.cwd(), 'http.log');
        }
    }

}
