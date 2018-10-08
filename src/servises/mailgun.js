/**
 * Mailgun  service.
 */

// Dependencies.
const querystring = require('querystring'),
      config = require('../config'),
      https = require('https'),
      Request = require('../servises/Request');

const mailgun = {};

/**
 * Charge the payment.
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @return {Promise}
 */
mailgun.send = (params, callback) => {//to, subject, text
    //checking that necessary params are present 
    if (!params.to || !params.subject || !params.text) {
      //reject(new Error('Missing required fields'));
    }

    // Configure the request payload.
    const payload = {
      to: 'pavlo.netrebsky@gmail.com',
      subject: "subject",
      text: "text",
      from: "postmaster@sandboxXXXXXXXXXXXXXXXXXX.mailgun.org",
    };
    // domainName: 'sandboxXXXXXXXXXXXXXXXXXX.mailgun.org',
    // host: 'api.mailgun.net',
    // authUsername: 'api',
    // privateKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
    // from: 'postmaster@sandboxXXXXXXXXXXXXXXXXXX.mailgun.org'

    // Configure the request details.
    const requestParams = {
      protocol: 'https',
      host: 'api.mailgun.net',
      path: '/v3/sandboxXXXXXXXXXXXXXXXXXX.mailgun.org/messages',
      auth: 'api:XXXXXXXXXXXXXXXXXXXXXXXXX',
      payload: querystring.stringify(payload)
    };

    // 
    Request.create().send(requestParams, (err, response) => {
      // 
      const status = response.statusCode;
      // 
      if (status === 200 || status === 201) {
        callback(false, response);
      } else {
        callback(err, response);
      }
    });
};

module.exports = mailgun;
