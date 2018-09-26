
const validators = {};

validators.isValidString = (str) => {
    return typeof(str) == 'string' && str.trim().length > 0;
};

validators.isValidPhoneNumber = (str) => {
    return typeof(str) == 'string' && str.trim().length >= 10;
};

validators.isValidEmail = (str) => {
    //TODO regexp
    return typeof(str) == 'string';
};

validators.isValidBoolen = (booleanValue) => {
    return typeof(booleanValue) == 'boolean' && booleanValue == true;
};

validators.isValidPassword = (password) => {
    //TODO improvment - add regex, pass should contain digit, upper case ..
    return typeof(password) == 'string' && password.trim().length >= 6;
}

module.exports = validators;