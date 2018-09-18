/* 
* Module for db
*/

//Dependencies
const fs = require('fs'),
      path = require('path');

let basePath = path.join(__dirname, '../../.data');

//Private method to create fullPath string
function _getPathToTheFile(dir, fileName){
    return basePath + '/' + dir + '/' + fileName + '.json';
}

//Container for methods (to be exported)
let database = {};

//Create new file and put data
database.create = (dir, fileName, data, callback) => {
    //open file for writing
    fs.open(_getPathToTheFile(dir, fileName), 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            //convert data to json string
            data = JSON.stringify(data); 
            
            //write converted data to the file and close it
            fs.writeFile(fileDescriptor, data, (err) => {
                if(!err){
                    fs.close(fileDescriptor, (err) => {
                        let responseMessage = err ? 'Can\'t close file' : 'Data has been written';
                        callback({response: responseMessage});
                    });
                } else {
                    callback({response: 'Can\'t write to file'});
                }
            });
        } else {
            callback({response: 'Can\'t create new file'});
        }
    });
};

//Read data from file
database.read = (dir, fileName, callback) => {
    //read the file and return data
    fs.readFile(_getPathToTheFile(dir, fileName), 'utf-8', (err, data) => {
        let responseMessage = err ? 'Can\'t read file' : data;
        callback({response: responseMessage});
    });
};

//Update file with new data
database.update = (dir, fileName, data, callback) => {
    //open file for writing
    fs.open(_getPathToTheFile(dir, fileName), 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            //convert data to json string
            data = JSON.stringify(data); 
            
            //write converted data to the file and close it
            fs.writeFile(fileDescriptor, data, (err) => {
                if(!err){
                    fs.close(fileDescriptor, (err) => {
                        let responseMessage = err ? 'Can\'t close file' : 'Data has been updated';
                        callback({response: responseMessage});
                    });
                } else {
                    callback({response: 'Can\'t write to file'});
                }
            });
        } else {
            callback({response: 'Can\'t create new file'});
        }
    });
};

database.delete = (dir, fileName, callback) => {
    //Unlink the file
    fs.unlink(_getPathToTheFile(dir, fileName), (err) => {
        let responseMessage = err ? 'Can\'t delete file' : 'File has been deleted';
        callback({response: responseMessage});
    });
};

module.exports = database;