/**
 * Order class
 */

//Dependencies
const helpers = require('../servises/helpers'),
      validators = require('../servises/validators'),
      database = require('../servises/database');  

class Order {
    constructor(data = {}){
        this.id = data.id || helpers.getRandomString(15);
        this.shoppingCartId = data.shoppingCartId;
        this.status = data.status || 'created';//TODO add Enumeration
        this.description = data.description;
        this.amount = data.amount;
        this.currency = data.currency;
        this.source = data.source;
    }

    /**
     * Returns collection name
     */
    static getCollectionName() {
        return 'order';
    }

    /**
     * Validation of necessary order fields 
     */
    isValid(){
        let isShoppingCartIdValid = validators.isValidString(this.shoppingCartId),
            isAmountValid = validators.isValidNumber(this.amount),
            isSourceValid = validators.isValidString(this.source);

        return isShoppingCartIdValid && isAmountValid && isSourceValid;
    }

    /**
     *  Get order from db by his id
     * @param {*} callback 
     */
    static getById(id, callback){
        database.read(Order.getCollectionName(), id, (response) => {
            let order = {};
            if(!response.err){
                let data = helpers.safeJsonParse(response.data);
                order = new Order(data);
            }

            callback(response.err, response.message, order);
        });
    }

    /**
     * Create new order
     * @param {*} callback 
     */
    create(callback){
        //create hash for password
        this.password = helpers.hash(this.password);
        
        //create file for new order
        database.create(Order.getCollectionName(), this.shoppingCartId, this, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        });
    }

    update(callback){
        database.update(Order.getCollectionName(), this.shoppingCartId, this, (response) => {
            //return response to controller 
            callback(response.err, response.message, response.data);
        });
    }

    /**
     * Delete order by his number
     * @param {*} callback 
     */
    delete(callback){
        database.delete(Order.getCollectionName(), this.shoppingCartId, (response) => {
            //return response to controller 
            callback(response.err, response.message);
        })
    }
}

module.exports = Order;