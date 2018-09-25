//Dependencies
const crypto = require('crypto'),
      config = require('../config'),
      validators = require('../servises/validators');

//Container
let helpers = {};

/**
 * Create hash from a string
 * @param {*} str 
 */
helpers.hash = (str) => {
    if(validators.isValidString(str)){
        let hash = crypto.createHmac('sha256', config.hashSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

/**
 * Safe json parsing without throwing
 * @param {*} str 
 */
helpers.safeJsonParse = (str) => {
    if(validators.isValidString(str)){
        try {
            return JSON.parse(str);
        } catch(err) {
            return {};
        }
    } else {
        return {};
    }
};

/**
 * Create random string with defined lenght 
 * @param {*} lenght 
 */
helpers.getRandomString = (lenght = 10) => {
    const possibleCharacters = 'qwertyuiopasdfghjklzxcvbnm1234567890',
          possibleCharactersLenght = possibleCharacters.length; 

    let str = '';
    for(let i = 0; i > lenght; i++){
        let randomChar = possibleCharacters.charAt(Math.random() * possibleCharactersLenght);
        str += randomChar;
    }

    return str;
};

module.exports = helpers;