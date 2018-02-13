var express = require('express');
var router = express.Router();
var patterns = [
  {id: 1, title: 'First', description: 'Desc'},
  {id: 2, title: 'Second', description: 'Desc'},
  {id: 3, title: 'Third', description: 'Desc'},
  {id: 4, title: 'Fourth', description: 'Desc'}
];

let patRouter = function(req, res, next) {
  setTimeout(function(){
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.cookie('cookie', 'it is cookie man !');
    res.send(patterns);
    next();
  }, 20);
};

function getPattern(id) {
  return patterns.filter(function (item) {
    return item.id === id;
  });
}

module.exports = patRouter;
