/**
 * User class
 */

//Dependencies
const validators = require('../servises/validators'),
      database = require('../servises/database');  

class User {
    constructor(data = {}){
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone;
        this.agreement = data.agreement;
        //password
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
        let isAgreementValid = validators.isValidAgreement(this.agreement);
        //password

        return isFirstNameValid && isLastNameValid && isAgreementValid;
    }

    /**
     *  Get user from db by his phone number
     * @param {*} callback 
     */
    static getByPhoneNumber(phone, callback){
        database.read(User.getCollectionName(), phone, (response) => {
            let user = {};
            if(!response.err){
                let data = JSON.parse(response.data)
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
        database.create(User.getCollectionName(), this.phone, this, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        });
    }

    update(callback){
        database.update(User.getCollectionName(), this.phone, this, (response) => {
            //return response to controller 
            callback(response.err, response.message, response.data);
        });
    }

    /**
     * Delete user by his number
     * @param {*} callback 
     */
    delete(callback){
        database.delete(User.getCollectionName(), this.phone, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        })
    }
}

module.exports = User;