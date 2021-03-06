
/**
 * Server 
 */

//Dependencies
const StringDecoder = require('string_decoder').StringDecoder,
      path = require('path'),
      url = require('url'),
      http = require('http'),
      https = require('https'),
      fs = require('fs'),
      config = require('./config'),
      routers = require('./routers'),
      helpers = require('./servises/helpers');

//Container for server methods
let server = {};

server.unifiedServer = (req, res) => {
    let buffer = '',
        parsedUrl = url.parse(req.url, true),
        requestedPathname = parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
        method = req.method.toLocaleLowerCase(),
        decoder = new StringDecoder('utf-8');

    req.on('data', (data) => {
      buffer += decoder.write(data);
    });
    
    req.on('end', () => {
      //get payloadData depending on method
      let payload = (['get'].indexOf(method) > -1) ? parsedUrl.query : helpers.safeJsonParse(buffer);
      
      //define params for handler
      let data = {
        path: requestedPathname,
        payload: payload,
        method: method,
        headers: req.headers
      };
      
      //if request to public directory, use public handler
      requestedPathname = requestedPathname.indexOf('public') > -1 ? 'public' : requestedPathname;

      //choose controller from routers object
      const chosenHandler = typeof(routers[requestedPathname]) !== 'undefined' ? routers[requestedPathname] : routers['notFound'];
      
      chosenHandler(data, (statusCode, data, contentType) => {
        let responseData;

        switch(contentType){ //TODO move this logic to handler
          // case 'json':
          //   data = typeof(data) == 'object' ? data : {};
          //   responseData = JSON.stringify(data);
          //   contentType = 'application/json';
          //   break;
          case 'html':
            responseData = typeof(data) == 'string' ? data : '';
            contentType = 'text/html';
            break;
          case 'png':
            responseData = typeof(data) !== 'undefined' ? data : '';
            contentType = 'image/png';
            break;
          case 'jpg':
          case 'jpeg':
            responseData = typeof(data) !== 'undefined' ? data : '';
            contentType = 'image/jpeg';
            break;
          case 'favicon':
            responseData = typeof(data) !== 'undefined' ? data : '';
            contentType = 'image/x-icon';
            break;
          case 'plaing':
            responseData = typeof(data) !== 'undefined' ? data : '';
            contentType = 'text/plain';
            break;
          case 'css':
            responseData = typeof(data) !== 'undefined' ? data : '';  
            contentType = 'text/css';
            break;
          case 'js':
            responseData = typeof(data) !== 'undefined' ? data : '';  
            contentType = 'text/js';
            break;
          default: 
            data = typeof(data) == 'object' ? data : {};
            responseData = JSON.stringify(data);
            contentType = 'application/json';
        }
      
        
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;//TODO create constants with codes

        res.setHeader('Content-type', contentType);
        res.writeHead(statusCode);
        res.end(responseData);
      });
    });
  }

  server.initHttpServer = () => {
    //Initialize http server
    server.httpServer = http.createServer((req, res) => {
      server.unifiedServer(req, res);
    });

    //Set http-server listen to port
    server.httpServer.listen(config.httpPort, () => {
      console.log('Server started on port ' + config.httpPort + ' with ' + config.envName + ' evn' );
    });
  }

  server.initHttpsServer = () => {
    //Define pathes to 'key' and 'cert' for https-server
    let httpsServerParams = {
      key : fs.readFileSync(path.join(__dirname, './../https/key.pem')),
      cert : fs.readFileSync(path.join(__dirname, './../https/cert.pem'))
    }

    //Initialize https server
    server.httpsServer = https.createServer(httpsServerParams, (req, res) => {
      server.unifiedServer(req, res);
    });

    //Set https-server listen to port
    server.httpsServer.listen(config.httpsPort, () => {
      console.log('Server started on port ' + config.httpsPort + ' with ' + config.envName + ' evn' );
    });
  }

  server.init = () => {
    server.initHttpServer();
    server.initHttpsServer();
  }

  module.exports = server;