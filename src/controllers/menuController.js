//Dependencies
const MenuItem = require('../models/MenuItem'),
      Token = require('../models/Token');

let menu = (data, callback) => {
    //permitted methods for controller
    const allowedMethods = {
        get: { needVerification: false }, 
        put: { needVerification: false }, 
        post: { needVerification: false }, 
        delete:{ needVerification: false }
    };

    //check if request method allowed for this controller
    if(allowedMethods[data.method] !== undefined) {
        //before perform operation, check that if method require logged user
        if(allowedMethods[data.method].needVerification){
            //check that user logged in 
            Token.verify(data.headers.token, data.payload.email, (tokenIsValid) => {
                if(tokenIsValid){
                    //get action according to request method
                    _menu[data.method](data.payload, callback);
                } else {
                    callback(403);
                }
            });
        } else {
            //current method doen't need token verification
            //get action according to request method
            _menu[data.method](data.payload, callback);
        }
    } else {
        callback(405);
    }
};

_menu = {};

_menu.get = (data, callback) => {
    //get all menu items
    MenuItem.getAll((err, message, items) => {
        if(!err){
            callback(200, items);
        } else {
            callback(400, {message: message});
        }
    });
};

module.exports = menu;