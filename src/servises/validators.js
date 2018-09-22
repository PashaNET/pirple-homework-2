
const validators = {};

validators.isValidString = (str) => {
    return typeof(str) == 'string' && str.trim().length > 0;
};

validators.isValidPhoneNumber = (number) => {
    return typeof(str) == 'string' && str.trim().length > 10;
};

validators.isValidAgreement = (agreement) => {
    return typeof(agreement) == 'boolean' && agreement == true;
};

module.exports = validators;