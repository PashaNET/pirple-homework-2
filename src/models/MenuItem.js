/**
 * MenuItem class
 */

//Dependencies
const helpers = require('../servises/helpers'),
      database = require('../servises/database');  

class MenuItem {
    static getCollectionName() {
        return 'menuItems';
    }

    /**
     *  Get whole menu from db
     * @param {*} callback 
     */
    static getAll(callback){
        database.read(MenuItem.getCollectionName(), 'menu-items', (response) => {
            let items = {};
            if(!response.err && response.data){
                items = helpers.safeJsonParse(response.data);
            }

            callback(response.err, response.message, items);
        });
    }
}

module.exports = MenuItem;