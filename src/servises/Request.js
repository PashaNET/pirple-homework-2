/**
 * Request class
 */

//Dependencies
const https = require('https'),
      http = require('http');

class Request {

    constructor(){
        this.http = http;
        this.https = https;
    }

    static create(){
        return new Request();
    }

    /**
     * Prepare and send request
     * @param {*} params 
     * @param {*} callback 
     */
    send(params = {}, callback){
        let requestData = {
            protocol: params.protocol + ':',
            hostname: params.host,
            method: params.methodType || 'POST',
            path: params.path,
            auth: params.auth,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(params.payload),
            },
        };
            
        const request = this[params.protocol].request(requestData, (response) => {
            if (response.statusCode === 200 || response.statusCode === 201) {
                callback(false, {message: 'OK'});
            } else {
                callback(true, {message: response.statusMessage});
            }
        });

        request.on('error', (error) => {
            callback(error);
        });
        request.write(params.payload);
        request.end();
    }
}    

module.exports = Request;