//
// Sequelize test
//

'use strict';

var Sequelize = require('sequelize');

var config = require('config');

var sequelize = new Sequelize(config.cn.database, config.cn.user, config.cn.password, {
    host: config.cn.host,
    dialect: 'postgresql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }});


var User = sequelize.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE
});

sequelize.sync({force: true}).then(function() {
    return User.create({
        username: 'janedoe',
        birthday: new Date(1980, 6, 20)
    });
}).then(function(jane) {
    console.log(jane.get({
        plain: true
    }));
});
