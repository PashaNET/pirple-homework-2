  
//Dependencies 
const pingController = require('./controllers/pingController'),
      tokenController = require('./controllers/tokenController'),
      userController = require('./controllers/userController'),
      menuController = require('./controllers/menuController'),
      shoppingCartController = require('./controllers/shoppingCartController'),
      orderController = require('./controllers/orderController');

let routers = {
  ping: pingController,
  notFound: null, //TODO create controller
  token: tokenController,
  user: userController,
  menu: menuController,
  cart: shoppingCartController,
  order: orderController
}

module.exports = routers;