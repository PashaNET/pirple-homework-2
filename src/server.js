
//Dependencies
const StringDecoder = require('string_decoder').StringDecoder,
      url = require('url'),
      routers = require('./routers'),
      helpers = require('./servises/helpers');

function unifiedServer(req, res){
    let parsedUrl = url.parse(req.url, true),
        path = parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
        method = req.method.toLocaleLowerCase(),
        decoder = new StringDecoder('utf-8'),
        buffer = '';

    req.on('data', (data) => {
      buffer += decoder.write(data);
    });
    
    req.on('end', () => {
      //get payloadData depending on method
      let payload = (['get', 'delete'].indexOf(method) > -1) ? parsedUrl.query : helpers.safeJsonParse(buffer);
      
      //define params for handler
      let data = {
        payload: payload,
        method: method
      };
      
      //choose controller from routers object
      const chosenHandler = typeof(routers[path]) !== 'undefined' ? routers[path] : routers['notFound'];
      
      //TODO add to each handler token verification
      chosenHandler(data, (statusCode, data) => {
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;//TODO create constants with codes
        data = typeof(data) == 'object' ? data : {};//TODO add method to helpers
        let responseData = JSON.stringify(data);
  
        res.setHeader('Content-type', 'application/json');
        res.writeHead(statusCode);
        res.end(responseData);
      });
    });
  }


module.exports = unifiedServer;