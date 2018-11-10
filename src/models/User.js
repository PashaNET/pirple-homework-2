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
        this.address = data.address;
        this.agreement = data.agreement;
        this.password = data.password;
        this.createdAt = data.createdAt || Date.now();
    }

    /**
     * Returns the name of collection
     */
    static getCollectionName() {
        return 'user';
    }

    /**
     * Validation of necessary user fields 
     */
    isValid(){
        let isFirstNameValid = validators.isValidString(this.firstName),
            isLastNameValid = validators.isValidString(this.lastName),
            isAgreementValid = validators.isValidBoolen(this.agreement),
            isPasswordValid = validators.isValidPassword(this.password);

        return isFirstNameValid && isLastNameValid && isAgreementValid && isPasswordValid;
    }
    
    /**
     * Get all users
     * @param {*} filter 
     * @param {*} callback 
     */
    static getAll(filter, callback){
        database.listAll(User.getCollectionName(), (response) => {
            if(!response.err && response.data.length > 0){
                
                response.data.forEach((item) => {
                    let email = item.replace('.json', '');

                    //convert to milliseconds and substruct from current date
                    filter = Date.now() - (filter * 60 * 60 * 1000);

                    User.getById(email, (err, message, user) => {
                        if(!err){
                            //show only user which have registration date greater than defined filter
                            if(user.createdAt > filter){
                                callback(false, user);
                            }
                        }
                    });
                });
            } else {
                callback(response.err, response.message, []);
            }
        });
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

    /**
     * Update existing user with new data
     * @param {*} data 
     * @param {*} callback 
     */
    update(data, callback){
        database.update(User.getCollectionName(), this.email, data, (response) => {
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