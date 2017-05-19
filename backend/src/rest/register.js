'use strict';

const Mailgun = require('mailgun-js');
const api_key = 'key-829eb9fb987d596dd8f2c741afe2f1b3';
const domain = 'sandboxc1d044d71fd74f0a985a2d5e2b1c83e0.mailgun.org';
const from_who = 'postmaster@sandboxc1d044d71fd74f0a985a2d5e2b1c83e0.mailgun.org';

const w = require('winston');
const request = require('request-promise-native');
const config = require('config');

function send_mail(recipient,subject,body) {
    let mailgun = new Mailgun({apiKey: api_key, domain: domain});
    let data = {
        //Specify email data
        from: from_who,
        //The email to contact
        to: recipient,
        //Subject and text data
        subject: subject,
        html: body
    };

    mailgun.messages().send(data, function (err, body) {
        if (err) {
            w.error("Recieved an error while sending email: ", err);
        }
        else {
            w.info(`Email was sent to ${recipient}.`);
        }
    });
}

exports.register_new_user = function (req, res) {
    w.info(`Registering new user: ${req.body.user_mail}`); // delete when read: dont show pw (it is dumped into system logs and a security breach)

    request({
        method: "POST",
        uri: `${config.java_be}/authentication/register`,
        json: {
            "password": req.body.user_password,
            "userId": req.body.user_mail
            }
    }).then((body) => {
        res.status(200).send(body);
        let email_body = `You have registered with name ${req.body.user_mail} and password ${req.body.user_password}.`;
        send_mail(req.body.user_mail, "Registration email test", email_body);
    }).catch((err) => {
        w.error(err);
        res.status(err.status).send(err);
    });
};
