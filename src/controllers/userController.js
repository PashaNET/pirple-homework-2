//Dependencies
const validators = require('../servises/validators'),
      User = require('../models/User');

let user = (data, callback) => {
    let allowedMethods = ['get', 'put', 'post', 'delete'];

    //check if request method allowed for this controller
    if(allowedMethods.indexOf(data.method) > -1) {
        //get action according to request method
        _user[data.method](data.payload, callback);
    } else {
        callback(405);
    }
};

_user = {};

_user.get = (data, callback) => {
    //check if number suit requirements
    let isEmailValid = validators.isValidEmail(data.email);

    if(isEmailValid){
        //check if user exist
        User.getByEmail(data.email, (err, message, user) => {
            if(!err){
                callback(200, user);
            } else {
                //such user doesn't exist 
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Invalid email number'});
    }
};

_user.put = (data, callback) => {
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
        callback(400, {message: 'Missed required params'});
    }
};

_user.post = (data, callback) => {
    //check if number suit requirements
    let isEmailValid = validators.isValidEmail(data.email);

    if(isEmailValid){
        //check if user already exist
        User.getByEmail(data.email, (err, message) => {
            if(!err){
                //if the no error - user with that email already exist
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
        callback(400, {message: 'Invalid email number'});
    }
};

_user.delete = (data, callback) => {//should take a param
    //check if number suit requirements
    let isEmailValid = validators.isValidEmail(data.email);

    if(isEmailValid){
        //check if user exist
        User.getByEmail(data.email, (err, message, user) => {
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
        callback(400, {message: 'Invalid email number'});
    }
};

module.exports = user;