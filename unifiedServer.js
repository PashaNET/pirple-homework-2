const StringDecoder = require('string_decoder').StringDecoder,
      url = require('url');

function unifiedServer(req, res){
    let parsedUrl = url.parse(req.url, true),
        queryStringObj = parsedUrl.query,
        path = parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
        method = req.method.toLocaleLowerCase(),
        headersObj = req.headers,
        decoder = new StringDecoder('utf-8'),
        buffer = '';

    req.on('data', (data) => {
      buffer += decoder.write(data);
    });
    req.on('end', () => {
      buffer += decoder.end();
  
      let data = {
        parsedUrl: parsedUrl,
        path: path,
        queryStringObj: queryStringObj,
        method: method,
        headersObj: headersObj,
        buffer: buffer
      }
  
      const chosenHandler = typeof(routers[path]) !== 'undefined' ? routers[path] : handlers.notFound;
      chosenHandler(data, (statusCode, data) => {
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        data = typeof(data) == 'object' ? data : {};
  
        let responseData = JSON.stringify(data);
  
        res.setHeader('Content-type', 'application/json');
        res.writeHead(statusCode);
        res.end(responseData);// + buffer + '\n');
      });
    });
  }

//define handlers TODO: move to separate file 
let handlers = {};

handlers.hello = (data, callback) => {
  callback(200, {helloPage: 'Hello World', data: data})
};
handlers.ping = (data, callback) => {
  callback(200)
};
handlers.aboutUs = (data, callback) => {
  callback(200, {about: 'succesfull handled', data: data})
};
handlers.notFound = (data, callback) => {
  callback(403, {error: 'page not found', data: data})
}

let routers = {
  hello: handlers.hello,
  ping: handlers.ping,
  about: handlers.aboutUs
}

module.exports = unifiedServer;