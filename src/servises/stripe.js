
/**
 * Stripe service.
 */

// Dependencies.
const querystring = require('querystring'),
      config = require('../config'),
      Request = require('./Request');

const stripe = {};

stripe.charge = async (params, callback) => {
    //checking that necessary params are present 
    if (!params.amount || !params.source || !params.currency) {
       callback(true, {message: 'Missing required params'});
    }

    //prepare params and payload for request to stripe
    let requestParams = {
        protocol: 'https',
        host: config.stripe.hostname,
        path: config.stripe.paymentPath,
        auth: config.stripe.secretKey + ':',
        payload: querystring.stringify(params),
        description: '',
        metadata: {}
    }

    Request.create().send(requestParams, (err, response) => {
        //
        let error = err ? err : false;
        callback(error, response);
    })
};

module.exports = stripe;