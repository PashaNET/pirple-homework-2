/**
 * Token class
 */

//Dependencies
const helpers = require('../servises/helpers'),
      validators = require('../servises/validators'),
      database = require('../servises/database');  

class Token {
    constructor(data = {}){
        this.email = data.email;
        this.tokenId = helpers.getRandomString(20);
        this.expires = Data.now() + 1000 * 60 * 60;
    }

    static getCollectionName() {
        return 'token';
    }

    /**
     *  Get token from db by email number
     * @param {*} callback 
     */
    static getByEmail(email, callback){
        database.read(Token.getCollectionName(), email, (response) => {
            let token = {};
            if(!response.err){
                let data = helpers.safeJsonParse(response.data);
                delete data.password;
                token = new Token(data);
            }

            callback(response.err, response.message, token);
        });
    }

    /**
     * Create new token
     * @param {*} callback 
     */
    create(callback){
        //create file for new token
        database.create(Token.getCollectionName(), this.email, this, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        });
    }

    /**
     * Update token with new data
     * @param {*} callback 
     */
    update(callback){
        database.update(Token.getCollectionName(), this.email, this, (response) => {
            //return response to controller 
            callback(response.err, response.message, response.data);
        });
    }

    /**
     * Delete token by his number
     * @param {*} callback 
     */
    delete(callback){
        database.delete(Token.getCollectionName(), this.email, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        })
    }
}

module.exports = Token;