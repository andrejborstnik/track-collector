'use strict';

//
// LIBRARIES
//


const express = require('express');
const async = require('co-express');
const router = express.Router();

const request = require('request-promise-native');
const moment = require('moment');
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

// const postgreApi = require('src/rest/postgreApi');
// const sequelizeTest = require('src/rest/sequelizeTest');
const register = require('src/rest/register');

w.info('Starting up in %s mode', config.__MODE__);

router.post('/api/queryDb/:query', function (req, res) {
    let query = decodeURI(req.params.query);
    let params = decodeURI(req.query.params); // todo parse safely

    // postgreApi.queryDb(query, params).then(function (result) {
    //     res.send(result);
    // }).catch(function (err) {
    //     w.error(err);
    //     res.status(400).send(err);
    // });
});

router.post('/api/track/:query', function (req, res) {
    let query = decodeURI(req.params.query);
    let params = req.body; // todo parse safely

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
          startDate: moment(params.startDate).format(),
          endDate: moment(params.endDate).format(),
          userId: "string"
        }
    }).then((body) => {
        res.send(body);
    }).catch((err) => {
        throw err;
    });
});


router.post('/api/register', register.register_new_user);

module.exports = router;

