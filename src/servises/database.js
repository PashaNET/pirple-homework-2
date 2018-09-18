/* 
* Module for 
*/

//Dependencies
const fs = require('fs'),
      path = require('path');

let database = {};
let basePath = path.join(__dirname, '../../.data');
database.create = (dir, fileName, data, callback) => {
    //open file for writing
    console.log('file name', basePath + '/' + dir + '/' + fileName + '.json');
    fs.open(basePath + '/' + dir + '/' + fileName + '.json', 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            //convert data to json string
            data = JSON.stringify(data); 
            
            //write converted data to the file
            fs.write(fileDescriptor, data, (err, fileDescriptor) => {
                if(!err && fileDescriptor){
                    callback({message: 'Data has been saved'});
                } else {
                    callback({error: 'Can\'t write to file'});
                }
            });
        } else {
            callback({error: 'Can\'t open file'});
        }
    });
};

database.read = () => {};
database.update = () => {};
database.delete = () => {};

module.exports = database;