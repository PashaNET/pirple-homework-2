//Dependencies
const validators = require('../servises/validators'),
      ShoppingCart = require('../models/ShoppingCart'),
      Token = require('../models/Token');

let shoppingCart = (data, callback) => {
    //permitted methods for controller
    const allowedMethods = {
        get: { needVerification: true }, 
        put: { needVerification: true }, 
        post: { needVerification: true }, 
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
                    _shoppingCart[data.method](data.payload, callback);
                } else {
                    callback(403);
                }
            });
        } else {
            //current method doen't need token verification
            //get action according to request method
            _shoppingCart[data.method](data.payload, callback);
        }
    } else {
        callback(405);
    }
};

_shoppingCart = {};

_shoppingCart.get = (data, callback) => {
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

_shoppingCart.post = (data, callback) => {
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
        callback(400, {message: 'Invalid email'});
    }
};

_shoppingCart.put = (data, callback) => {
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

_shoppingCart.delete = (data, callback) => {//should take a param
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

module.exports = shoppingCart;