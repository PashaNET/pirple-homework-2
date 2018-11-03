/* 
* Module for db
*/

//Dependencies
const fs = require('fs'),
      path = require('path');

let basePath = path.join(__dirname, '../../.data');

//Private method to create fullPath string
function _concatPathToTheFile(dir, fileName){
    return basePath + '/' + dir + '/' + fileName + '.json';
}

//Private method to create response object
function _prepareResponse(message = "", err = null, data = {}){
    return {
        message: message,
        err: err,
        data: data
    }
}

//Container for methods (to be exported)
let database = {};
//Create new file and put data
database.create = (dir, fileName, data, callback) => {
    //open file for writing
    fs.open(_concatPathToTheFile(dir, fileName), 'wx', (err, fileDescriptor) => {//TODO create a dir automatically if it doesn't exist
        if(!err && fileDescriptor){
            //convert data to json string
            data = JSON.stringify(data); 
            
            //write converted data to the file and close it
            fs.writeFile(fileDescriptor, data, (err) => {
                if(!err){
                    fs.close(fileDescriptor, (err) => {
                        let responseMessage = err ? 'Can\'t close file' : 'Data has been written';
                        callback(_prepareResponse(responseMessage, err));
                    });
                } else {
                    callback(_prepareResponse('Can\'t write to file', err));
                }
            });
        } else {
            callback(_prepareResponse('Can\'t create new file it might exist', err));
        }
    });
};

//Read data from file
database.read = (dir, fileName, callback) => {
    //read the file and return data
    fs.readFile(_concatPathToTheFile(dir, fileName), 'utf-8', (err, data) => {
        let responseMessage = err ? 'Can\'t read file' : 'OK';
        callback(_prepareResponse(responseMessage, err, data));
    });
};

//Update file with new data
database.update = (dir, fileName, data, callback) => {
    //open file for writing
    fs.open(_concatPathToTheFile(dir, fileName), 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            //convert data to json string
            data = JSON.stringify(data); 
            
            //write converted data to the file and close it
            fs.writeFile(fileDescriptor, data, (err) => {
                if(!err){
                    fs.close(fileDescriptor, (err) => {
                        let responseMessage = err ? 'Can\'t close file' : 'Data has been updated';
                        callback(_prepareResponse(responseMessage, err, data));
                    });
                } else {
                    callback(_prepareResponse('Can\'t write to file', err));
                }
            });
        } else {
            callback(_prepareResponse('Can\'t create new file', err));
        }
    });
};

database.delete = (dir, fileName, callback) => {
    //Unlink the file
    fs.unlink(_concatPathToTheFile(dir, fileName), (err) => {
        let responseMessage = err ? 'Can\'t delete file' : 'File has been deleted';
        callback(_prepareResponse(responseMessage, err));
    });
};

module.exports = database;