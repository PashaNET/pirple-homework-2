const crypto = require('crypto'),
      config = require('../config');

let helpers = {};

helpers.hash = (str) => {
    if(typeof(str) == 'string' && str.length > 0){
        let hash = crypto.createHmac('sha256', config.hashSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

module.exports = helpers;