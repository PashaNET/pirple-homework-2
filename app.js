/* 
* Primary file for API
*/

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder,
      config = require('./config');

const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true);

  let queryStringObj = parsedUrl.query;
  let path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  let method = req.method.toLocaleLowerCase();
  let headersObj = req.headers;

  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
    // console.log('line-->' + buffer + '\n');
  });
  req.on('end', () => {
    buffer += decoder.end();
    // console.log(headersObj);

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
});

server.listen(config.port, () => {
  console.log('Server started on port ' + config.port + ' with ' + config.envName + ' evn' );
});

//define handlers
let handlers = {};

handlers.home = (data, callback) => {
  callback(200, {home: 'succesfull handled', data: data})
};
handlers.aboutUs = (data, callback) => {
  callback(200, {about: 'succesfull handled', data: data})
};
handlers.notFound = (data, callback) => {
  callback(403, {error: 'page not found', data: data})
}

//define router obj
let routers = {
  home: handlers.home,
  about: handlers.aboutUs
}
