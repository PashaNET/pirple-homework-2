// import { setTimeout } from 'timers';

var express = require('express');
var router = express.Router();
var patterns = [
  {id: 1, title: 'First', description: 'Desc'},
  {id: 2, title: 'Second', description: 'Desc'},
  {id: 3, title: 'Third', description: 'Desc'},
  {id: 4, title: 'Fourth', description: 'Desc'}
];

/* GET home page. */
router.get('/', function(req, res, next) {
  setTimeout(function(){
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.send(patterns);
  }, 2000);
});

/* GET users listing. */
router.get('/pattern/:id', function(req, res, next) {
  setTimeout(function(){
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.send(getPattern(req.params.id));
  }, 2000);
});

function getPattern(id) {
 
  var requested_item =  patterns.find(function (item) {
    return item.id == id;
  });

  return requested_item;
}

module.exports = router;
