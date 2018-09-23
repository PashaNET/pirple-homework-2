//Dependencies
const validators = require('../servises/validators'),
      User = require('../models/User');

let users = (data, callback) => {
    let allowedMethods = ['get', 'put', 'post', 'delete'];

    //check if request method allowed for this controller
    if(allowedMethods.indexOf(data.method) > -1) {
        //create new user instance
        let user = new User(data.payload);// get user by phone

        //get action according to request method
        _users[data.method](user, callback);
    } else {
        callback(405);
    }
};

_users = {};

_users.get = (user, callback) => {

};

_users.put = (user, callback) => {
    //check if income data valid
    if(user.isValid()){
        //check if user already exist
        user.update((err, message) => {
            if(!err){
                //if the no error user successfully updated
                callback(100, {message: message});
            } else {
                callback(400, {message: message});
            }
        });
    } else {
        callback(400, {message: 'Missing required params or user already exist'});
    }
};

_users.post = (user, callback) => {
    //check if income data valid
    if(user.isValid()){
        //check if user already exist
        user.alreadyExist((err, message) => {
            if(!err){
                //if the no error - user with that phone already exist
                callback(400, {message: message});
            } else {
                //user doesn't exist so create new one
                user.create((err, message) => {
                    callback(200, {message: message});
                });
            }
        });
    } else {
        callback(400, {message: 'Missing required params or user already exist'});
    }
};

_users.delete = (user, callback) => {//should take a param
    //check if user already exist
    user.alreadyExist((err, message) => {
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
};

module.exports = users;