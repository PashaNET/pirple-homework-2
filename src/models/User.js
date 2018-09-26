/**
 * User class
 */

//Dependencies
const helpers = require('../servises/helpers'),
      validators = require('../servises/validators'),
      database = require('../servises/database');  

class User {
    constructor(data = {}){
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.agreement = data.agreement;
        this.password = data.password;
    }

    static getCollectionName() {
        return 'user';
    }

    /**
     * Validation of user fields 
     */
    isValid(){
        let isFirstNameValid = validators.isValidString(this.firstName);
        let isLastNameValid = validators.isValidString(this.lastName);
        let isAgreementValid = validators.isValidBoolen(this.agreement);
        let isPasswordValid = validators.isValidPassword(this.password);

        return isFirstNameValid && isLastNameValid && isAgreementValid && isPasswordValid;
    }

    /**
     *  Get user from db by his email number
     * @param {*} callback 
     */
    static getByEmail(email, callback){
        database.read(User.getCollectionName(), email, (response) => {
            let user = {};
            if(!response.err){
                let data = helpers.safeJsonParse(response.data);
                user = new User(data);
            }

            callback(response.err, response.message, user);
        });
    }

    /**
     * Create new user
     * @param {*} callback 
     */
    create(callback){
        //create hash for password
        this.password = helpers.hash(this.password);
        
        //create file for new user
        database.create(User.getCollectionName(), this.email, this, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        });
    }

    update(callback){
        database.update(User.getCollectionName(), this.email, this, (response) => {
            //return response to controller 
            callback(response.err, response.message, response.data);
        });
    }

    /**
     * Delete user by his number
     * @param {*} callback 
     */
    delete(callback){
        database.delete(User.getCollectionName(), this.email, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        })
    }
}

module.exports = User;