//Dependencies
const validators = require('../servises/validators'),
      User = require('../models/User');

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
        //check if user exist
        User.getByEmail(data.Email, (err, message, user) => {
            if(!err){
                callback(200, user);
            } else {
                //such user doesn't exist 
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Invalid Email number'});
    }
};

_token.put = (data, callback) => {
    //create new user instance
    let user = new User(data);

    //check if income data valid
    if(user.isValid()){
        //check if user already exist
        user.update((err, message) => {
            if(!err){
                //if the no error user successfully updated
                callback(200, {message: message});
            } else {
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Missing required params or user already exist'});
    }
};

_token.post = (data, callback) => {
    //check if number suit requirements
    let isEmailValid = validators.isValidEmail(data.Email);

    if(isEmailValid){
        //check if user already exist
        User.getByEmail(data.Email, (err, message) => {
            if(!err){
                //if the no error - user with that Email already exist
                callback(400, {message: message});
            } else {
                //user doesn't exist so create new one
                let user = new User(data);
                //check if income data valid
                if(user.isValid()){
                    user.create((err, message) => {
                        callback(200, {message: message});
                    });
                } else {
                    callback(400, {message: 'Missing required params or user already exist'});
                }
            }
        });
    } else {
        callback(400, {message: 'Invalid Email number'});
    }
};

_token.delete = (data, callback) => {//should take a param
    //check if number suit requirements
    let isEmailValid = validators.isValidEmail(data.Email);

    if(isEmailValid){
        //check if user exist
        User.getByEmail(data.Email, (err, message, user) => {
            if(!err){
                //if the no error, we can delete this user
                user.delete((err, message) => {
                    callback(400, {message: message});
                });
            } else {
                //such user doesn't exist 
                callback(200, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Invalid Email number'});
    }
};

module.exports = token;