'use strict';

//
// LIBRARIES
//


const express = require('express');
const async = require('co-express');
const router = express.Router();

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

module.exports = router;

