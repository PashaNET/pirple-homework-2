/* 
* Main file 
*/

//Dependencies 
const server = require('./src/server'),
      cli = require('./src/cli');

let app = {};

app.init = () => {
  //start web server
  server.init();

  //start the CLI in 100 mls
  setTimeout(() => {
    cli.init();
  }, 100)
};

app.init();

module.exports = app;
