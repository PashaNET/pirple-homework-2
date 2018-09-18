  
let handlers = {};

handlers.ping = (data, callback) => {
  callback(200)
};

let routers = {
  ping: handlers.ping,
  notFound: null
}

module.exports = routers;