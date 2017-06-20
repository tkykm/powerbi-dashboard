var express = require('express');
var router = express.Router();
const config = require('../lib/config')
const getPowerbiToken = require('../lib/powerbi')

/* GET home page. */
router.get('/', function(req, res, next) {
  var token = getPowerbiToken(res, req)
  if (token){
    res.render('index', { config: config, token: token});
  }
});

module.exports = router;
