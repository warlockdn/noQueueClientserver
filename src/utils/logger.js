const winston = require('winston');
const dailyRotate = require('winston-daily-rotate-file');

const logger = winston.createLogger({
    transports: [
        new dailyRotate({
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
        new transports.Console({
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