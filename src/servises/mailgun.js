/**
 * Mailgun  service.
 */

// Dependencies.
const querystring = require('querystring'),
      config = require('../config'),
      emailTemplates = require('../emailTemplates'),
      Request = require('../servises/Request');

const mailgun = {};

/**
 * Charge the payment.
 * @param {object} params
 * @param {string} emailType
 * @param {function} callback
 */
mailgun.send = (params, emailType, callback) => {
    //checking that necessary params are present 
    if (!params.source || !params.subject || !params.text) {

        //check if there exist template for current emailType
        if(typeof emailTemplates[emailType] == 'undefined'){
            //log
            return;
        }
    }

    // Configure the request payload.
    const payload = {
        to: params.source,
        subject: emailType + ' ' + params.id,
        text: emailTemplates[emailType](params),
        from: config.mailgun.fromAddress,
    };

    // Configure the request details.
    const requestParams = {
        protocol: 'https',
        host: config.mailgun.host,
        path: config.mailgun.path,
        auth: config.mailgun.authUsername + ':' + config.mailgun.authKey,
        payload: querystring.stringify(payload)
    };

    //Create instanse of Request class and send email 
    Request.create().send(requestParams, (err, response) => {
        callback(err, response);
        //check status code
        //response.statusCode, statusMessage
        //TODO log
    });
};

module.exports = mailgun;
