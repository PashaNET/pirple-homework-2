
//Dependencies
const StringDecoder = require('string_decoder').StringDecoder,
      url = require('url'),
      routers = require('./routers'),
      helpers = require('./servises/helpers'),
      querystring = require('querystring');

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
      let payload = (method == 'get') ? parsedUrl.query : helpers.safeJsonParse(buffer);
      
      //define params for handler
      let data = {
        payload: payload,
        method: method
      };
      
      //choose controller from routers object
      const chosenHandler = typeof(routers[path]) !== 'undefined' ? routers[path] : routers['notFound'];
      
      chosenHandler(data, (statusCode, data) => {
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;//TODO create constants with codes
        data = typeof(data) == 'object' ? data : {};

        let responseData = JSON.stringify(data);
  
        res.setHeader('Content-type', 'application/json');
        res.writeHead(statusCode);
        res.end(responseData);
      });
    });
  }


module.exports = unifiedServer;