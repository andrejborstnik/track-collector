//
// Sequelize test
//

'use strict';

const Sequelize = require('sequelize');
const config = require('config');

let sequelize = new Sequelize(
    config.cn.database,
    config.cn.user,
    config.cn.password,
    {host: config.cn.host,
    dialect: 'postgresql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }});

let GPSRecord = sequelize.define('gpsrecord', {
    speed: Sequelize.REAL,
    longtitude: Sequelize.REAL,
    latitude: Sequelize.REAL,
    accuracy: Sequelize.REAL,
    altitude: Sequelize.REAL,
    altitudeAccuracy: Sequelize.REAL,
    heading: Sequelize.REAL,
    isMoving: Sequelize.BOOLEAN,
    odometer: Sequelize.REAL,
    recordUUID: Sequelize.STRING,
    activityType: Sequelize.STRING,
    activityConfidence: Sequelize.STRING,
    batteryLevel: Sequelize.REAL,
    batteryCharging: Sequelize.BOOLEAN,
    timestamp: Sequelize.DATE,
    uuid: Sequelize.STRING,
    manufacturer: Sequelize.STRING,
    model: Sequelize.STRING,
    version: Sequelize.STRING,
    platform: Sequelize.STRING
});

// If "force: true", then overwrite current tables
sequelize.sync({force: true});
