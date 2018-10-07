//Dependencies
const validators = require('../servises/validators'),
      Order = require('../models/Order'),
      Token = require('../models/Token'),
      stripe = require('../servises/stripe');

let order = (data, callback) => {
    //permitted methods for controller
    const allowedMethods = {
        get: { needVerification: true }, 
        put: { needVerification: true }, 
        post: { needVerification: false }, 
        delete:{ needVerification: true }
    };

    //check if request method allowed for this controller
    if(allowedMethods[data.method] !== undefined) {
        //before perform operation, check that if method require logged order
        if(allowedMethods[data.method].needVerification){
            //check that order logged in 
            Token.verify(data.headers.token, data.payload.email, (tokenIsValid) => {
                if(tokenIsValid){
                    //get action according to request method
                    _order[data.method](data.payload, callback);
                } else {
                    callback(403);
                }
            });
        } else {
            //current method doen't need token verification
            //get action according to request method
            _order[data.method](data.payload, callback);
        }
    } else {
        callback(405);
    }
};

_order = {};

_order.get = (data, callback) => {
    //check if number suit requirements
    let isIdValid = validators.isValidString(data.id);

    if(isIdValid){
        //check if order exist
        Order.getById(data.id, (err, message, order) => {
            if(!err){
                callback(200, order);
            } else {
                //such order doesn't exist 
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Invalid id'});
    }
};

_order.post = (data, callback) => {
    //check if number suit requirements
    let isIdValid = validators.isValidString(data.id);
    stripe.charge({amount: 250}, (err, response) => {
        if(!err){
            callback(200, response);
        } else {
            callback(500, response);
        }
    });
    return;
    if(isIdValid){
        //check if order already exist
        Order.getById(data.id, (err, message) => {
            if(!err){
                //if the no error - order with that id already exist
                callback(400, {message: message});
            } else {
                //order doesn't exist so create new one
                let order = new Order(data);
                //check if income data valid
                if(order.isValid()){
                    order.create((err, message) => {
                        //sent request to payment system
                        //sent email to user
                        
                        callback(200, {message: message});
                    });
                } else {
                    callback(400, {message: 'Required params is invalid or order already exist'});
                }
            }
        });
    } else {
        callback(400, {message: 'Invalid id'});
    }
};

_order.put = (data, callback) => {
    //create new order instance
    let order = new Order(data);

    //check if income data valid
    if(order.isValid()){
        //check if order already exist
        order.update((err, message) => {
            if(!err){
                //if the no error order successfully updated
                callback(200, {message: message});
            } else {
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Missed required params'});
    }
};

_order.delete = (data, callback) => {
    //check if number suit requirements
    let isIdlValid = validators.isValidString(data.id);

    if(isIdlValid){
        //check if order exist
        Order.getById(data.id, (err, message, order) => {
            if(!err){
                //if the no error, we can delete this order
                order.delete((err, message) => {
                    callback(400, {message: message});
                });
            } else {
                //such order doesn't exist 
                callback(200, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Invalid id'});
    }
};

module.exports = order;