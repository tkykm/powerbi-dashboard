var express = require('express');
var router = express.Router();
const config = require('../lib/config')
const getPowerbiToken = require('../lib/powerbi')

router.post('/report', function(req, res, next) {
  var url = req.body.url
  var page = req.body.page
  var token = getPowerbiToken(res, req)
  if (token){
    res.render('report', { config: config, token: token, url: url, page: page});
  }
});

router.get('/report', function(req, res, next) {
    next()
});

module.exports = router;
