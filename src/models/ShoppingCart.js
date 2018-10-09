/**
 * ShoppingCart class
 */

//Dependencies
const helpers = require('../servises/helpers'),
      validators = require('../servises/validators'),
      database = require('../servises/database');  

class ShoppingCart {
    constructor(data = {}){
        this.id = helpers.getRandomString(15);
        this.items = data.items;// {itemId: 1, quantity: 2}
    }

    /**
     * Returns collection name 
     */
    static getCollectionName() {
        return 'shopping-cart';
    }

    /**
     * Validation of necessary cart fields 
     */
    isValid(){
        let isItemsValid = validators.isNoEmptyArray(this.items);

        return isItemsValid;
    }

    /**
     *  Get cart from db by it id
     * @param {*} callback 
     */
    static getById(email, callback){
        database.read(ShoppingCart.getCollectionName(), email, (response) => {
            let cart = {};
            if(!response.err){
                let data = helpers.safeJsonParse(response.data);
                cart = new ShoppingCart(data);
            }

            callback(response.err, response.message, cart);
        });
    }

    /**
     * Create new cart
     * @param {*} callback 
     */
    create(callback){
        //create hash for password
        this.password = helpers.hash(this.password);
        
        //create file for new cart
        database.create(ShoppingCart.getCollectionName(), this.email, this, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        });
    }

    update(callback){
        database.update(ShoppingCart.getCollectionName(), this.email, this, (response) => {
            //return response to controller 
            callback(response.err, response.message, response.data);
        });
    }

    /**
     * Delete cart by it id
     * @param {*} callback 
     */
    delete(callback){
        database.delete(ShoppingCart.getCollectionName(), this.email, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        })
    }
}

module.exports = ShoppingCart;