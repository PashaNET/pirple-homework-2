/**
 * Frontend scripts
 */

 // app container
let app = {};

app.config = {
    sessionToken: false
};

app.client = {
    request: (headers, path, method, queryStringObject, payload, callback) => {
        // Validate and set default values to parameters
        headers = typeof(headers) == 'object' && headers !== null ? headers : {};
        path = typeof(path) == 'string' ? path : '/';
        method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
        queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
        payload = typeof(payload) == 'object' && payload !== null ? payload : {};
        callback = typeof(callback) == 'function' ? callback : false;
      
        // For each query string parameter sent, add it to the path
        let requestUrl = path + '?',
            index = 0,
            lastIndex = Object.keys(queryStringObject).length - 1;

        for(let queryKey in queryStringObject) {
            if(queryStringObject.hasOwnProperty(queryKey)) {
                index++;
                requestUrl +=queryKey + '=' + queryStringObject[queryKey];

                if(index !== lastIndex) {
                    requestUrl += '&';
                }
            }
        }
      
        // Form the http request as a JSON type
        let xhr = new XMLHttpRequest();
        xhr.open(method, requestUrl, true);
        xhr.setRequestHeader("Content-type", "application/json");
      
        // For each header sent, add it to the request
        for(let headerKey in headers) {
           if(headers.hasOwnProperty(headerKey)) {
             xhr.setRequestHeader(headerKey, headers[headerKey]);
           }
        }
      
        // Add sessiontoken as a header
        if(app.config.sessionToken) {
          xhr.setRequestHeader("token", app.config.sessionToken.id);
        }
      
        //Handle the response
        xhr.onreadystatechange = function() {
            if(xhr.readyState == XMLHttpRequest.DONE) {
              let statusCode = xhr.status;
              let responseReturned = xhr.responseText;
      
              // Callback if requested
              if(callback) {
                try {
                  let parsedResponse = JSON.parse(responseReturned);
                  callback(statusCode,parsedResponse);
                } catch(e) {
                  callback(statusCode,false);
                }
              }
            }
        }
      
        // Send the payload as JSON
        let payloadString = JSON.stringify(payload);
        xhr.send(payloadString);
      }
};
