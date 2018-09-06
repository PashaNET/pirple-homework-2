/* 
* Primary file for API
*/

//Dependencies
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url);
  console.log(parsedUrl.path);
  res.end('Just test\n');
});

server.listen(3001, () => {
  console.log('Server started');
});