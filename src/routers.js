  
//Dependencies 
const pingController = require('./controllers/pingController'),
      tokenController = require('./controllers/tokenController'),
      userController = require('./controllers/userController');

let routers = {
  ping: pingController,
  notFound: null,
  token: tokenController,
  user: userController 
}

module.exports = routers;