'use strict';

//
// LIBRARIES
//


const express = require('express');
const async = require('co-express');
const router = express.Router();

const request = require('request-promise-native');
// Setup Cross Origin Resource Sharing.
const cors = require('cors');
router.use(cors());

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const HttpStatus = require('http-status-codes');

const config = require('config');

const w = require('winston');
w.level = config.log_level;

const postgreApi = require('src/rest/postgreApi');
const sequelizeTest = require('src/rest/sequelizeTest');

w.info('Starting up in %s mode', config.__MODE__);

router.get('/api/queryDb/:query', function (req, res) {
    let query = decodeURI(req.params.query);
    let params = decodeURI(req.query.params); // todo parse safely

    postgreApi.queryDb(query, params).then(function (result) {
        res.send(result);
    }).catch(function (err) {
        w.error(err);
        res.status(400).send(err);
    });
});

router.get('/api/track/:query', function (req, res) {
    let query = decodeURI(req.params.query);
    let params = decodeURI(req.query.params); // todo parse safely

    request({
        method: "POST",
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        uri:'https://test.goopti.com/tracker/test/gpsQuery',
        body: {
          deviceId: "string",
          startDate: "2017-04-21T09:15:00Z",
          endDate: "2017-04-21T12:00:00.00Z",
          userId: "string"
        }
    }).then((body) => {
        res.send(body);
    }).catch((err) => {
        throw err;
    });
});

module.exports = router;

