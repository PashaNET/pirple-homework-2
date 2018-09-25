/**
 * Token class
 */

//Dependencies
const helpers = require('../servises/helpers'),
      database = require('../servises/database');  

class Token {
    constructor(email){
        this.email = email;
        this.tokenId = helpers.getRandomString(20);
        this.expires = Date.now() + 1000 * 60 * 60;
    }

    static getCollectionName() {
        return 'token';
    }

    /**
     *  Get token from db by email number
     * @param {*} callback 
     */
    static getById(id, callback){
        database.read(Token.getCollectionName(), id, (response) => {
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
        database.create(Token.getCollectionName(), this.tokenId, this, (response) => {
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