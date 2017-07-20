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
const resetPassword = require('src/rest/resetPassword');

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

router.post('/api/track', function (req, res) {
    let params = req.body; // todo parse safely

    request({
        method: "POST",
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        uri:`${config.java_be}${config.java_be_path}/tracker/gpsQuery`,
        body: {
            endDate: moment(params.endDate).format(),
            groupId: params.groupId,
            requiredAccuracy: params.requiredAccuracy,
            singlePointStops: params.singlePointStops,
            startDate: moment(params.startDate).format(),
            token: params.token,
            userIds: params.userIds
        }
    }).then((body) => {
        res.send(body);
    }).catch((err) => {
        throw err;
    });
});

router.post('/api/group/list', function (req, res) {
    let params = req.body; // todo parse safely

    request({
        method: "POST",
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        uri:`${config.java_be}${config.java_be_path}/group/list`,
        body: {
            token: params.token,
        }
    }).then((body) => {
        res.send(body);
    }).catch((err) => {
        throw err;
    });
});

router.post('/api/group/register', function (req, res) {
    request({
        method: "POST",
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: req.body,
        uri:`${config.java_be}${config.java_be_path}/group/register`,
    }).then((body) => {
        res.send(body);
    }).catch((err) => {
        throw err;
    });
});

router.get('/api/authentication/providers/list', function (req, res) {
    request({
        method: "GET",
        headers: {
            'Accept': 'application/json',
        },
        uri:`${config.java_be}${config.java_be_path}/authentication/providers/list`,
    }).then((body) => {
        res.send(body);
    }).catch((err) => {
        throw err;
    });
});

router.post('/api/authentication/update', function (req, res) {
    request({
        method: "POST",
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: req.body,
        uri:`${config.java_be}${config.java_be_path}/authentication/update`,
    }).then((body) => {
        res.send(body);
    }).catch((err) => {
        throw err;
    });
});

router.post('/api/authentication/profile', function (req, res) {
    request({
        method: "POST",
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: req.body,
        uri:`${config.java_be}${config.java_be_path}/authentication/profile`,
    }).then((body) => {
        res.send(body);
    }).catch((err) => {
        throw err;
    });
});

router.post('/api/authentication/oneTimeToken', function (req, res) {
    request({
        method: "POST",
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: req.body,
        uri:`${config.java_be}${config.java_be_path}/authentication/authenticate`,
    }).then((body) => {
        res.send(body);
    }).catch((err) => {
        throw err;
    });
});


router.post('/api/register', register.register_new_user);
router.post('/api/resetPassword', resetPassword.resetPassword);

router.post('/api/signin', function (req, res) {
    let params = req.body; // todo parse safely

    request({
        method: "POST",
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        uri:`${config.java_be}${config.java_be_path}/authentication/authenticate`,
        body: req.body
    }).then((body) => {
        res.send(body);
    }).catch((err) => {
        throw err;
    });

});





module.exports = router;
