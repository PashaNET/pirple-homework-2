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
  
  let method = req.method.toLocaleLowerCase();

  let headersObj = req.headers;

  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
    console.log('line-->' + buffer + '\n');
  });
  req.on('end', () => {
    buffer += decoder.end();
    // console.log(headersObj);
    res.end('Payload text --> ');// + buffer + '\n');
  });
  
});

server.listen(3001, () => {
  console.log('Server started');
});