'use strict';

const w = require('winston');
const request = require('request-promise-native');
const config = require('config');
const secretResetKey = "zamenjajme";

const generatePasswordResetEmail = function(email,token){
    var body = `Password reset link: ???/resetPassword?resetToken=${token}`
    var email = {to: email, subject: "Password reset request", body: body}
    return email
}

exports.resetPassword = function (req, res) {
    if (typeof req.body.email != 'undefined'){
        w.info(`Resetting password for: ${req.body.email}`); // delete when read: dont show pw (it is dumped into system logs and a security breach)
        request({
            method: "POST",
            uri: `${config.java_be}/authentication/resetPassword`,
            json: {
                "secret": secretResetKey,
                "userId": req.body.email
                }
        }).then((body) => {
            w.info(body); //print the token until we actually send an email
            if (body.status!="OK"){
                res.status(500).send(body.status);
            }else {
                res.status(200).send("OK");
                var email = generatePasswordResetEmail(req.body.email,body.resetToken);
                w.info("Outgoing email:");
                w.info(email);
            }
        }).catch((err) => {
            w.error(err);
            res.status(err.status).send(err);
        });
    }else if ((typeof req.body.resetToken != 'undefined') && (typeof req.body.password != 'undefined')){
        request({
            method: "POST",
            uri: `${config.java_be}/authentication/resetPassword`,
            json: {
                "secret": secretResetKey,
                "newPassword": req.body.password,
                "resetToken": req.body.resetToken
                }
        }).then((body) => {
            w.info(body);
            if (body.status!="OK"){
                res.status(500).send(body.status);
            }else {
                res.status(200).send(body);
            }
        }).catch((err) => {
            w.error(err);
            res.status(err.status).send(err);
        });
    }else {
        res.status(400).send("Invalid request");
    }
};
