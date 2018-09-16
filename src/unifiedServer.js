const StringDecoder = require('string_decoder').StringDecoder,
      url = require('url');

function unifiedServer(req, res){
    let parsedUrl = url.parse(req.url, true),
        path = parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
        decoder = new StringDecoder('utf-8'),
        buffer = '';

    req.on('data', (data) => {
      buffer += decoder.write(data);
    });
    req.on('end', () => {
      let data = {}
  
      const chosenHandler = typeof(routers[path]) !== 'undefined' ? routers[path] : handlers.notFound;
      chosenHandler(data, (statusCode, data) => {
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        data = typeof(data) == 'object' ? data : {};
  
        let responseData = JSON.stringify(data);
  
        res.setHeader('Content-type', 'application/json');
        res.writeHead(statusCode);
        res.end(responseData);
      });
    });
  }
  
let handlers = {};

handlers.ping = (data, callback) => {
  callback(200)
};

let routers = {
  ping: handlers.ping
}

module.exports = unifiedServer;