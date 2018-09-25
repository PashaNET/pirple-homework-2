//Dependencies
const validators = require('../servises/validators'),
      helpers = require('../servises/helpers'),
      Token = require('../models/Token');

let token = (data, callback) => {
    let allowedMethods = ['get', 'put', 'post', 'delete'];

    //check if request method allowed for this controller
    if(allowedMethods.indexOf(data.method) > -1) {
        //get action according to request method
        _token[data.method](data.payload, callback);
    } else {
        callback(405);
    }
};

_token = {};

_token.get = (data, callback) => {
    //check if number suit requirements
    let isEmailValid = validators.isValidEmail(data.Email);

    if(isEmailValid){
        //check if token exist
        Token.getByEmail(data.Email, (err, message, token) => {
            if(!err){
                callback(200, token);
            } else {
                //such token doesn't exist 
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Invalid Email number'});
    }
};

_token.put = (data, callback) => {
    //create new token instance
    let token = new Token(data);

    //check if income data valid
    if(token.isValid()){
        //check if token already exist
        token.update((err, message) => {
            if(!err){
                //if the no error token successfully updated
                callback(200, {message: message});
            } else {
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Missed required params'});
    }
};

_token.post = (data, callback) => {
    //check if params suit requirements
    let isEmailValid = validators.isValidEmail(data.email);
    let isPasswordValid = validators.isValidPassword(data.password);

    if(isEmailValid && isPasswordValid){
        //get token by email
        Token.getByEmail(data.email, (err, message, tokenData) => {
            if(!err && tokenData){
                if(helpers.hash(data.password) == tokenData.password){
                    let token = new Token(tokenData.email);
                    token.create((err) => {
                        if(!err){
                            callback(200, token);
                        } else {
                            callback(400, {message: 'Can\'t create token file'});
                        }
                    });
                } else {
                    callback(400, {message: 'Incorrect password or such token email doesn\'t exist'});
                }
            } else {
                callback(400, {message: 'No such token'});
            }
        });
    } else {
        callback(400, {message: 'Invalid parameters'});
    }
};

_token.delete = (data, callback) => {//should take a param
    //check if number suit requirements
    let isEmailValid = validators.isValidEmail(data.Email);

    if(isEmailValid){
        //check if token exist
        Token.getByEmail(data.email, (err, message, token) => {
            if(!err){
                //if the no error, we can delete this token
                token.delete((err, message) => {
                    callback(400, {message: message});
                });
            } else {
                //such token doesn't exist 
                callback(200, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Invalid Email number'});
    }
};

module.exports = token;