'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var crypto = require('crypto');
var router = express.Router();
const config = require('../lib/config');
var AuthenticationContext = require('adal-node').AuthenticationContext;
var setToken = require('../lib/powerbi')


var tenant = 'common'
var authorityHostUrl = 'https://login.windows.net'
var authorityUrl = authorityHostUrl + '/' + tenant;
var resource = 'https://analysis.windows.net/powerbi/api';
var templateAuthzUrl = 'https://login.windows.net/' + tenant + '/oauth2/authorize?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>';

function createAuthorizationUrl(state) {
  var authorizationUrl = templateAuthzUrl.replace('<client_id>', config.clientid);
  authorizationUrl = authorizationUrl.replace('<redirect_uri>',config.redirecturl);
  authorizationUrl = authorizationUrl.replace('<state>', state);
  authorizationUrl = authorizationUrl.replace('<resource>', resource);
  return authorizationUrl;
}

router.get('/initialize', function(req, res, next) {
  // console.log(req.cookies);
  res.cookie('acookie', 'this is a cookie');

  res.send('\
<head>\
  <title>initial login</title>\
</head>\
<body>\
  <p>トークン発行のための初期ログインが必要です. 管理者に連絡してください</p>\
  <a href="./admin/auth">Login</a>\
</body>\
    ');
});


// Clients get redirected here in order to create an OAuth authorize url and redirect them to AAD.
// There they will authenticate and give their consent to allow this app access to
// some resource they own.
router.get('/admin/auth', function(req, res, next) {
  crypto.randomBytes(48, function(ex, buf) {
    var token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');

    res.cookie('authstate', token);
    var authorizationUrl = createAuthorizationUrl(token);

    res.redirect(authorizationUrl);
  });
});

// After consent is granted AAD redirects here.  The ADAL library is invoked via the
// AuthenticationContext and retrieves an access token that can be used to access the
// user owned resource.
router.get('/getAToken', function(req, res, next) {
  if (req.cookies.authstate !== req.query.state) {
    res.send('error: state does not match');
  }
  var authenticationContext = new AuthenticationContext(authorityUrl);
  authenticationContext.acquireTokenWithAuthorizationCode(req.query.code, config.redirecturl, resource, config.clientid, config.clientsecret, function(err, response) {
    if (err) {
      res.send('error: ' + err.message + '\n');
      console.log('error: ' + err.message + '\n')
      return;
    }
    else
      setToken(null, null, 'regist', response)
      res.redirect('/')
  });
});

module.exports = router;