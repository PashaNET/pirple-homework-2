//Dependencies
const validators = require('../servises/validators');

let users = (data, callback) => {
    let allowedMethods = ['get', 'put', 'post', 'delete'];
    if(allowedMethods.indexOf(data.method) > -1) {
        _users[data.method](data, callback);
    } else {
        callback(405);
    }
};

_users = {};
_users.get = (data, callback) => {

};

_users.put = (data, callback) => {};

_users.post = (data, callback) => {
    //check if income data valid
    let isFirstNameValid = validators.isValidString(data.payload.firstName);//rename to parse... (method will return value)
    let isLastNameValid = validators.isValidString(data.payload.lastName);
    let isPhoneValid = validators.isValidString(data.payload.phone);
    let isAgreementValid = validators.isValidString(data.payload.agreement);

    if( isFirstNameValid && isLastNameValid && isPhoneValid && isAgreementValid){
        //check if exit
        //if not write
    } else {
        callback(400, {message: 'Missing required params'});
    }
};

_users.delete = (data, callback) => {};

module.exports = users;