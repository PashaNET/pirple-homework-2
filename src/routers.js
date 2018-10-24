  
//Dependencies 
const pingController = require('./controllers/pingController'),
      tokenController = require('./controllers/tokenController'),
      userController = require('./controllers/userController'),
      menuController = require('./controllers/menuController'),
      shoppingCartController = require('./controllers/shoppingCartController'),
      orderController = require('./controllers/orderController'),
      pageHandler = require('./pages/pageHandler');
      
let routers = {
  //API json handlers
  'ping': pingController,
  'api/token': tokenController,
  'api/user/': userController,
  'api/menu': menuController,
  'api/cart': shoppingCartController,
  'api/order': orderController,

  //HTML handlers
  '': pageHandler.index,
  'account/create': pageHandler.account,
  'account/edit': pageHandler.account,
  'account/logout': pageHandler.account,
  'session/create': pageHandler.session, //???
  'favicon.ico': pageHandler.favicon,
  'public': pageHandler.public,
  'notFound': null, //TODO create controller


  //menu-list
  //cart
}
// 1. Signup on the site
// 2. View all the items available to order
// 3. Fill up a shopping cart
// 4. Place an order (with fake credit card credentials), and receive an email receipt

module.exports = routers;