
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
    //   callback(true, {message: 'Missing required fields'});
    }

    let parameters = {
        amout: params.amount || '300',
        currency: params.currency || 'USD',
        source: params.source || 'p@gmail.com'
    }

    //prepare all params and payload for stripe service
    let requestParams = {
        protocol: 'https',
        host: config.stripe.hostname,
        path: config.stripe.paymentPath,
        auth: config.stripe.secretKey + ':',
        payload: querystring.stringify({...parameters}),
        description: '',
        metadata: {}
    }

    Request.create().send(requestParams, (err, response) => {
        if(!err){
            callback(false, response)
        } else {
            callback(err, response);
        }
    })
};

module.exports = stripe;