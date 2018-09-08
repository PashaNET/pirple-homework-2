/* 
* Primary file for API
*/

//Dependencies
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true);
  
  let queryStringObj = parsedUrl.query;
  
  let method = req.method.toLocaleLowerCase();

  let headersObj = req.headers;
  
  res.end('Just test ' + method + '\n');

  console.log(headersObj);
});

server.listen(3001, () => {
  console.log('Server started');
});