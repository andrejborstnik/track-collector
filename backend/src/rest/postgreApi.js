'use strict';

const _ = require('lodash');
const w = require('winston');
const config = require('config');
const pgp = require('pg-promise')();

w.level = config.log_level;
 
// Simple example. Use pooling for more.
// TODO move to backend after we have login.

let db = pgp(config.cn);
w.debug(config.cn)
 
exports.queryDb = function (query, params) {
    return db.any(query, params);
}
