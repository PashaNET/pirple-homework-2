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
        //get list of files 
        database.read(MenuItem.getCollectionName(), 'menu', (response) => {
            let items = {};
            if(!response.err && response.data){
                items = helpers.safeJsonParse(response.data);
            }

            callback(response.err, response.message, items);
        });
    }
}

module.exports = MenuItem;