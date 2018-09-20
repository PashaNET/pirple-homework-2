/* 
* Primary file for API
*/

//Dependencies
const http = require('http'),
      https = require('https'),
      config = require('./src/config'),
      unifiedServer = require('./src/server'),
      fs = require('fs');

//Initialize http server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

//Define pathes to 'key' and 'cert' for https-server
let httpsServerParams = {
  key : fs.readFileSync('./https/key.pem'),
  cert : fs.readFileSync('./https/cert.pem')
}

//Initialize https server
const httpsServer = https.createServer(httpsServerParams, (req, res) => {
  unifiedServer(req, res);
});

//Set http-server listen to port
httpServer.listen(config.httpPort, () => {
  console.log('Server started on port ' + config.httpPort + ' with ' + config.envName + ' evn' );
});

//Set https-server listen to port
httpsServer.listen(config.httpsPort, () => {
  console.log('Server started on port ' + config.httpsPort + ' with ' + config.envName + ' evn' );
});