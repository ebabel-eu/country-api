(function () {
    'use strict';

    // Load dependencies.
    var config = require('./config.js'),
        express = require('express'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        db = mongoose.createConnection(config.mongodb),
        app = express(),
        api;

    // App will parse JSON payloads.
    app.use(bodyParser.json());

    // Simple logger.
    app.use(function (req, res, next) {
        console.log('%s %s', req.method, req.url);
        next();
    });

    // Set generic headesr for all responses.
    app.use(function (req, res, next) {
        res.set({
            'X-Powered-By': 'NodeJS',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
            'Cache-Control': 'public, max-age=' + config.expiryDate,
            'Expires': new Date(Date.now() + config.expiryDate).toUTCString()
        });
        next();
    });

    // Load country API.
    api = require('./src/api.js')(app, {'mongoose': mongoose, 'db': db});

    // Start listening on a given ip and port.
    app.listen(config.port, config.ip, function () {
        console.log('Listening on ' + config.ip + ':' + config.port);
    });
}());