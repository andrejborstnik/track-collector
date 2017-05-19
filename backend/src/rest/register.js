'use strict';

var Mailgun = require('mailgun-js');
var api_key = 'key-829eb9fb987d596dd8f2c741afe2f1b3';
var domain = 'sandboxc1d044d71fd74f0a985a2d5e2b1c83e0.mailgun.org';
var from_who = 'postmaster@sandboxc1d044d71fd74f0a985a2d5e2b1c83e0.mailgun.org';

function send_mail(recipient,subject,body) {
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
    var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: recipient,
    //Subject and text data  
      subject: subject,
      html: body}

    mailgun.messages().send(data, function (err, body) {
        if (err) {
            console.log("got an sending mail error: ", err);
        }
        else {
            console.log("email was sent.");
        }
    });
}

exports.register_new_user = function (req, res) {
    console.log("registering new user:");
    console.log(req.body);
    
    console.info("Poskus registracije.");

    const request = require('request-promise-native');

    request({
        method: "POST",
        uri: "https://test.goopti.com/tracker/authentication/register",
        json: {
            "password": req.body.user_password,
            "userId": req.body.user_mail
            }
    }).then((body) => {
        this.output = body;
    });
    console.info("Konec registracije.");
    
    
    let body = "you have registered with name:" + req.body.user_mail +
                " and password:" + req.body.user_password;
    send_mail(req.body.user_mail,"Registration email test",body);
    res.set('Content-Type', 'text/plain')
    res.status(200).send(`You sent: ${body} to the backend`)
}
