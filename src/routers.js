  
//Dependencies 
const pingController = require('./controllers/pingController'),
      userController = require('./controllers/userController');

let routers = {
  ping: pingController,
  notFound: null,
  user: userController 
}

module.exports = routers;