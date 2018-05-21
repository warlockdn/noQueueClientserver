const winston = require('winston');
require('winston-daily-rotate-file');

const logger = new(winston.createLogger)({
    transports: [
        new(winston.transports.DailyRotateFile)({
            filename: 'logs/log-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: true,
            json: false
        }),
        new(winston.transports.Console)({
            filename: 'logs/log-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: false,
            json: false
        })
    ]
});

if (process.env.NODE_ENV === 'PRODUCTION') {
    logger.info('Started Logger on:- ', new Date());
}

module.exports = logger;
module.exports.stream = {
    write: function (message) {
        logger.info(message);
    }
};