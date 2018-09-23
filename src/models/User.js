/**
 * User class
 */

//Dependencies
const validators = require('../servises/validators'),
      database = require('../servises/database');  

class User {
    constructor(data = {}){
        this.collectionName = 'user';
        
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone;
        this.agreement = data.agreement;
    }

    /**
     * Validation of user fields 
     */
    isValid(){
        let isFirstNameValid = validators.isValidString(this.firstName);
        let isLastNameValid = validators.isValidString(this.lastName);
        let isPhoneValid = validators.isValidString(this.phone);
        let isAgreementValid = validators.isValidAgreement(this.agreement);

        return isFirstNameValid && isLastNameValid && isPhoneValid && isAgreementValid;
    }

    /**
     *  Method to check if user exist
     * @param {*} callback 
     */
    alreadyExist(callback){
        database.read(this.collectionName, this.phone, (response) => {
            //user file exist if error object contains nothing
            callback(response.err, response.message);
        });
    }

    /**
     * Create new user
     * @param {*} callback 
     */
    create(callback){
        database.create(this.collectionName, this.phone, this, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        });
    }

    update(callback){
        database.update(this.collectionName, this.phone, this, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        });
    }

    /**
     * Delete user by his number
     * @param {*} callback 
     */
    delete(callback){
        database.delete(this.collectionName, this.phone, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        })
    }
}

module.exports = User;