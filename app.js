/* 
* Primary file for API
*/

//Dependencies
const http = require('http'),
      https = require('https'),
      config = require('./src/config'),
      unifiedServer = require('./src/server'),
      fs = require('fs');

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

let httpsServerParams = {
  key : fs.readFileSync('./https/key.pem'),
  cert : fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerParams, (req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
  console.log('Server started on port ' + config.httpPort + ' with ' + config.envName + ' evn' );
});
httpsServer.listen(config.httpsPort, () => {
  console.log('Server started on port ' + config.httpsPort + ' with ' + config.envName + ' evn' );
});