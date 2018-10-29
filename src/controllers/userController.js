//Dependencies
const validators = require('../servises/validators'),
      User = require('../models/User'),
      Token = require('../models/Token');

let user = (data, callback) => {
    //permitted methods for controller
    const allowedMethods = {
        get: { needVerification: true }, 
        put: { needVerification: true }, 
        post: { needVerification: false }, 
        delete:{ needVerification: true }
    };

    //check if request method allowed for this controller
    if(allowedMethods[data.method] !== undefined) {
        //before perform operation, check that if method require logged user
        if(allowedMethods[data.method].needVerification){
            //check that user logged in 
            Token.verify(data.headers.token, data.payload.email, (tokenIsValid) => {
                if(tokenIsValid){
                    //get action according to request method
                    _user[data.method](data.payload, callback);
                } else {
                    callback(403);
                }
            });
        } else {
            //current method doen't need token verification
            //get action according to request method
            _user[data.method](data.payload, callback);
        }
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
                //remove password before returning
                delete data.password;
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

_user.post = (data, callback) => {
    //check if number suit requirements
    let isEmailValid = validators.isValidEmail(data.email);

    if(isEmailValid){
        //check if user already exist
        User.getByEmail(data.email, (err, message, user) => {
            if(!err){
                //if there no error - such user exist
                callback(400, {message: 'User with that already exist'});
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
        callback(400, {message: 'Invalid email'});
    }
};

_user.put = (data, callback) => {
    //check if params suit requirements
    let isEmailValid = validators.isValidEmail(data.email);

    //check if income data valid
    if(isEmailValid){
        //get user from db by his email
        User.getByEmail(data.email, (err, message, user) => {
            if(!err){
                //update user with new data
                user.update(data, (err, message) => {
                    if(!err){
                        //if the no error user successfully updated
                        callback(200, {message: message});
                    } else {
                        callback(400, {message: message});
                    }
                });
            } else {
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Missed required params'});
    }
};

_user.delete = (data, callback) => {//should take a param
    //check if params suit requirements
    let isEmailValid = validators.isValidEmail(data.email);

    if(isEmailValid){
        //check if user exist
        User.getByEmail(data.email, (err, message, user) => {
            if(!err){
                //if the no error, we can delete this user
                user.delete((err, message) => {
                    responseCode = err ? 400 : 200;
                    callback(responseCode, {message: message});
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