require("babel-polyfill");
const express = require('express');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const helmet = require('helmet');
const Raven = require('raven');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/routes');
const logger = require('./utils/logger');

const firebase = require('./providers/firebase');

// Must configure Raven before doing anything else with it
Raven.config(process.env.SENTRY_CODE, { sendTimeout: 5 }).install();

const app = express();
app.disable('x-powered-by');
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/v1/status', (req, res) => {
    res.json({
        statusCode: 200,
        version: '0.1 Alpha',
        versionname: process.env.CODE_NAME
    })
})

app.use('/v1', routes);

// Error Reporting
app.use(Raven.requestHandler());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// The error handler must be before any other error middleware
app.use(Raven.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    res.statusCode = 500;
    res.end(res.sentry + '\n');
});

app.listen(3003);