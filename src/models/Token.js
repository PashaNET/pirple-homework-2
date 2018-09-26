/**
 * Token class
 */

//Dependencies
const helpers = require('../servises/helpers'),
      database = require('../servises/database');  

class Token {
    constructor(data = {}){
        this.email = data.email;
        this.tokenId = data.tokenId;
        this.expires = data.expires;
    }

    /**
     * Method keeps and return folder name for tokens
     */
    static getCollectionName() {
        return 'token';
    }

    /**
     * Get token from db by id
     * @param {*} id 
     * @param {*} callback 
     */
    static getById(id, callback){
        database.read(Token.getCollectionName(), id, (response) => {
            let token = {};
            if (!response.err){
                let tokenData = helpers.safeJsonParse(response.data);
                token = new Token(tokenData);
            }

            callback(response.err, response.message, token);
        });
    }

    /**
     * 
     */
    generateId(){
        this.tokenId = helpers.getRandomString(20);
    }

    /**
     * Set expire time on one hour by default
     * @param {*} time 
     */
    setExpireTime(time = Date.now()){
        this.expires = time + 1000 * 60 * 60;
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
        //check if token still valid
        if(this.expires < Date.now()){
            //update expire time on one hour
            this.setExpireTime();
        } else {
            callback(true, 'Token is expired');
        }
        
        database.update(Token.getCollectionName(), this.tokenId, this, (response) => {
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