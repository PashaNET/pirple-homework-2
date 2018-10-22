  
//Dependencies 
const pingController = require('./controllers/pingController'),
      tokenController = require('./controllers/tokenController'),
      userController = require('./controllers/userController'),
      menuController = require('./controllers/menuController'),
      shoppingCartController = require('./controllers/shoppingCartController'),
      orderController = require('./controllers/orderController'),
      templateController = require('./pages/templateController');
      
let routers = {
  //API json handlers
  'ping': pingController,
  'api/token': tokenController,
  'api/user/': userController,
  'api/menu': menuController,
  'api/cart': shoppingCartController,
  'api/order': orderController,

  //HTML handlers
  '': templateController.index,//TODO
  notFound: null, //TODO create controller

  //account/signin
  //account/login
  //account/logout
  //account/delete
  //menu-list
  //cart
}
// 1. Signup on the site
// 2. View all the items available to order
// 3. Fill up a shopping cart
// 4. Place an order (with fake credit card credentials), and receive an email receipt

module.exports = routers;