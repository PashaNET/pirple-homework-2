/* 
* Main file 
*/

//Dependencies 
const server = require('./src/server');

let app = {};

app.init = () => {
  server.init();
};

app.init();

module.exports = app;
