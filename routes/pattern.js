var express = require('express');
var router = express.Router();
var patterns = [
  {id: 1, title: 'First', description: 'Desc'},
  {id: 2, title: 'Second', description: 'Desc'},
  {id: 3, title: 'Third', description: 'Desc'},
  {id: 4, title: 'Fourth', description: 'Desc'}
];

/* GET users listing. */
router.get('/pattern/:id', function(req, res, next) {
  res.send(getPattern(1));
});

function getPattern(id) {
  return patterns.filter(function (item) {
    return item.id === id;
  });
}

module.exports = router;
