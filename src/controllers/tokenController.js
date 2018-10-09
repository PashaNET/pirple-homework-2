//Dependencies
const validators = require('../servises/validators'),
      helpers = require('../servises/helpers'),
      User = require('../models/User'),
      Token = require('../models/Token');

let token = (data, callback) => {
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
                    _token[data.method](data.payload, callback);
                } else {
                    callback(403);
                }
            });
        } else {
            //current method doen't need token verification
            //get action according to request method
            _token[data.method](data.payload, callback);
        }
    } else {
        callback(405);
    }
};

_token = {};

_token.get = (data, callback) => {
    //check if icome parameter suit requirements
    let isIdValid = validators.isValidString(data.id);

    if(isIdValid){
        //read token by id
        Token.getById(data.id, (err, message, token) => {
            if(!err){
                callback(200, token);
            } else {
                //such token doesn't exist 
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Invalid id'});
    }
};

_token.post = (data, callback) => {
    //check if params suit requirements
    let isEmailValid = validators.isValidEmail(data.email);
    let isPasswordValid = validators.isValidPassword(data.password);

    if(isEmailValid && isPasswordValid){
        //get token by email
        User.getByEmail(data.email, (err, message, userData) => {
            if(!err && userData){
                if(helpers.hash(data.password) == userData.password){
                    //create token instance 
                    let token = new Token({email: userData.email});
                    token.generateId();
                    token.setExpireTime();

                    //write instanse to file 
                    token.create((err) => {
                        if(!err){
                            callback(200, token);
                        } else {
                            callback(400, {message: 'Can\'t create token file'});
                        }
                    });
                } else {
                    callback(400, {message: 'Incorrect password or user with that email doesn\'t exist'});
                }
            } else {
                callback(400, {message: 'No such token'});
            }
        });
    } else {
        callback(400, {message: 'Invalid parameters'});
    }
};

_token.put = (data, callback) => {
    //check if icome parameter suit requirements
    let isIdValid = validators.isValidString(data.id);
    let isExtendParamValid = validators.isValidBoolen(data.extend);

    if(isIdValid && isExtendParamValid){
        //read token by id
        Token.getById(data.id, (err, message, token) => {
            if(!err){
                token.update((err, message) => {
                    if(!err){
                        //if the no error token successfully updated
                        callback(200, token);
                    } else {
                        callback(400, {message: message});
                    }
                });
            } else {
                //such token doesn't exist 
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Missed required params'});
    }
};

_token.delete = (data, callback) => {
    //check if icome parameter suit requirements
    let isIdValid = validators.isValidString(data.id);

    if(isIdValid){
        //read token by id
        Token.getById(data.id, (err, message, token) => {
            if(!err){
                //delete token 
                token.delete((err) => {
                    if(!err){
                        callback(200, {message: 'Access token has been deleted'});
                    } else {
                        callback(400, {message: 'Can\'t delete token'});
                    }
                })
            } else {
                //such token doesn't exist 
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Invalid id'});
    }
};

module.exports = token;