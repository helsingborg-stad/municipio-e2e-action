export default class Logger {
    startGreen = '\x1b[32m';
    endGreen = '\x1b[0m';
    checkSymbol = `${this.startGreen}\u2713${this.endGreen}`;
    startRed = '\x1b[31m';
    endRed = '\x1b[0m';
    crossSymbol = `${this.startRed}\u2717${this.endRed}`;

    log(message: string) {
        console.log(message);
    }

    logSuccess(message: string) {
        this.log(`${this.checkSymbol} ${message}`);
    }

    logError(message: string) {
        this.log(`${this.crossSymbol} ${message}`);
    }
}