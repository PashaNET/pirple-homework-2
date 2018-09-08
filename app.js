/* 
* Primary file for API
*/

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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
      let responseData = JSON.stringify(data);
      res.writeHead(statusCode);
      res.end(responseData);// + buffer + '\n');
    });
  });
});

server.listen(3001, () => {
  console.log('Server started');
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
