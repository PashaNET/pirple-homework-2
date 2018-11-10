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
        this.createdAt = data.createdAt || Date.now();
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
     * Get all orders which fit to the filter
     * @param {*} filter 
     * @param {*} callback 
     */
    static getAll(filter, callback){
        database.listAll(Order.getCollectionName(), (response) => {
            if(!response.err && response.data.length > 0){
                //
                response.data.forEach((item) => {
                    let id = item.replace('.json', '');

                    //convert to milliseconds and substruct from current date
                    filter = Date.now() - (filter * 60 * 60 * 1000);

                    Order.getById(id, (err, message, order) => {
                        if(!err){
                            //show only orders which have registration date greater than defined filter
                            if(order.createdAt > filter){
                                callback(false, order);
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