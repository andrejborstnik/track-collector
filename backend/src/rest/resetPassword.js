'use strict';

const w = require('winston');
const request = require('request-promise-native');
const config = require('config');



exports.resetPassword = function (req, res) {
    w.info(`Resetting password for: ${req.body.email}`); // delete when read: dont show pw (it is dumped into system logs and a security breach)

    res.status(200).send("");
};
