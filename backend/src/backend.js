//
// Backend server
//


'use strict';

const be_start = new Date();


//
// LIBRARIES
//


const w = require('winston');

// Express server.
const express = require('express');
const backend = express();

// Import application config.
const config = require('config');

// Routes
const routes = require('routes');


//
// FUNCTIONS
//


// Development error handler - will print stacktrace.
backend.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


//
// MAIN
//

w.level = config.log_level;

// Express backend server configuration.
backend.use('/', routes);

// Get port from environment and store in Express.
backend.set('port', config.be_port);

// Create HTTP server.
backend.on('*', err => console.log(err));
backend.listen(config.be_port);


process.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE') {
        w.error("Address already in use, exiting...");
        process.exit(1);
    }
});

w.info("Backend start time: %d ms.", new Date() - be_start);
