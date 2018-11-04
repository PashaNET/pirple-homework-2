/**
 * ShoppingCart class
 */

//Dependencies
const helpers = require('../servises/helpers'),
      validators = require('../servises/validators'),
      database = require('../servises/database'),
      Menu = require('../models/MenuItem');

class ShoppingCart {
    constructor(data = {}){
        this.id = data.id || helpers.getRandomString(15);
        this.items = data.items;// {itemId: 1, itemName: '', quantity: 2}
        this.amount = data.amount;
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
        let isItemsValid = validators.isNotEmptyArray(this.items);

        return isItemsValid;
    }

    /**
     * Read goods from db, get their prices and return totalAmount 
     * @param {*} callback 
     */
    getTotalAmount(callback){
        Menu.getAll((err, message, products) => {
            if(!err){
                let totalPrice = 0;

                //get all items in cart
                this.items.forEach((item) => {
                    //find product by his id in cart and get his price
                    products.forEach((product) => {
                        if(product.id === item.itemId){
                            totalPrice += parseFloat(product.price);
                        }
                    });
                });
                callback(false, totalPrice);
            } else {
                callback(err, {message: message});
            }
        });
    }

    /**
     *  Get cart from db by it id
     * @param {*} callback 
     */
    static getById(id, callback){
        database.read(ShoppingCart.getCollectionName(), id, (response) => {
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
        this.getTotalAmount((err, totalAmount) => {
            if(!err){
                this.amount = totalAmount;
                //create file for new cart
                database.create(ShoppingCart.getCollectionName(), this.id, this, (response) => {
                    //return response to controller 
                    callback(response.err, response.message, response.data);
                });
            } else {
                callback(err, 'Can\'t count totalAmount');
            }
        });
    }

    update(callback){
        this.getTotalAmount((err, totalAmount) => {
            if(!err){
                this.amount = totalAmount;
                database.update(ShoppingCart.getCollectionName(), this.id, this, (response) => {
                    //return response to controller 
                    callback(response.err, response.message, response.data);
                });
            } else {
                callback(err, 'Can\'t count totalAmount');
            }
        });
    }

    /**
     * Delete cart by it id
     * @param {*} callback 
     */
    delete(callback){
        database.delete(ShoppingCart.getCollectionName(), this.id, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        })
    }
}

module.exports = ShoppingCart;