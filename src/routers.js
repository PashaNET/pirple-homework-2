  
//Dependencies 
const pingController = require('./controllers/pingController'),
      tokenController = require('./controllers/tokenController'),
      userController = require('./controllers/userController');

let routers = {
  ping: pingController,
  notFound: null, //TODO create controller
  token: tokenController,
  user: userController,
  menu: menuController 
}

module.exports = routers;