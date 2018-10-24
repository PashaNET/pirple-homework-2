  
//Dependencies 
const pingController = require('./controllers/pingController'),
      tokenController = require('./controllers/tokenController'),
      userController = require('./controllers/userController'),
      menuController = require('./controllers/menuController'),
      shoppingCartController = require('./controllers/shoppingCartController'),
      orderController = require('./controllers/orderController'),
      userInterfaceHandler = require('./pages/userInterfaceHandler');
      
let routers = {
  //API json handlers
  'ping': pingController,
  'api/token': tokenController,
  'api/user/': userController,
  'api/menu': menuController,
  'api/cart': shoppingCartController,
  'api/order': orderController,

  //HTML handlers
  '': userInterfaceHandler.index,
  'account/create': userInterfaceHandler.account,
  'account/edit': userInterfaceHandler.account,
  'account/logout': userInterfaceHandler.account,
  'session/create': userInterfaceHandler.session, //???
  'favicon.ico': userInterfaceHandler.favicon,
  'public': userInterfaceHandler.public,
  'notFound': (data, callback) => {
    callback(403, {}, 'html');
  }, //TODO create controller


  //menu-list
  //cart
}
// 1. Signup on the site
// 2. View all the items available to order
// 3. Fill up a shopping cart
// 4. Place an order (with fake credit card credentials), and receive an email receipt

module.exports = routers;