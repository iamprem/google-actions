'use strict';

const winston = require('winston');
const expressWinston = require('express-winston');

// Default winston logging configuration
winston.configure({
    transports: [
        new winston.transports.Console({
            json: false,
            colorize: true,
            timestamp: true,
            humanReadableUnhandledException: true
        }),
        new (winston.transports.File)({
            filename: 'log/application.log',
            colorize: true,
            maxsize: 500000,
            zippedArchive: true,
            json: false
        })
    ]
});

// Logger to capture all requests and output them to the console.
const requestLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true,
            timestamp: true,
            humanReadableUnhandledException: true
        }),
        new winston.transports.File({
            filename: "log/request.log",
            colorize: true,
            maxsize: 500000,
            zippedArchive: true
        })
    ],
    expressFormat: true,
    meta: false
});

// Logger to capture any top-level errors and output json diagnostic info.
const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true,
            timestamp: true,
            humanReadableUnhandledException: true
        }),
        new winston.transports.File({
            colorize: true,
            filename: "log/error.log",
            maxsize: 500000,
            zippedArchive: true
        })
    ],
    level: "info"
});

module.exports = {
    requestLogger: requestLogger,
    errorLogger: errorLogger,
    error: winston.error,
    warn: winston.warn,
    info: winston.info,
    log: winston.log,
    verbose: winston.verbose,
    debug: winston.debug,
    silly: winston.silly
};