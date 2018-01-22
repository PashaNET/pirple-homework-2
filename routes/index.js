// import { setTimeout } from 'timers';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  setTimeout(function(){
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.send([1, 2, 3]);
  }, 2000);
});

module.exports = router;
