var constants = require('../../node_modules/adal-node/lib/constants');
var argument = require('../../node_modules/adal-node/lib/argument');
var TokenRequest = require('../../node_modules/adal-node/lib/token-request');
var AuthenticationContext = require('../../node_modules/adal-node/lib/authentication-context').AuthenticationContext;
var OAuth2GrantType = constants.OAuth2.GrantType;
var AccountType = constants.UserRealm.AccountType;
var OAuth2Parameters = constants.OAuth2.Parameters;

TokenRequest.prototype._getTokenUsernamePasswordManagedWithClientCredentials = function(username, password, clientSecret, callback) {
    this._log.verbose('Acquiring token with username password client credentials for managed user');
    var oauthParameters = this._createOAuthParameters(OAuth2GrantType.PASSWORD);
    oauthParameters[OAuth2Parameters.PASSWORD] = password;
    oauthParameters[OAuth2Parameters.USERNAME] = username;
    oauthParameters[OAuth2Parameters.CLIENT_SECRET] = clientSecret;  
  
    this._oauthGetToken(oauthParameters, callback);
  };

TokenRequest.prototype.getTokenWithUsernamePasswordClientCredentials = function(username, password, clientSecret, callback) {
    this._log.info('Acquiring token using username password with client authentication');
    this._userId = username;

    this._getTokenWithCacheWrapper(callback, function(getTokenCompleteCallback) {
        var self = this;
        this._userRealm = this._createUserRealmRequest(username);
        this._userRealm.discover(function(err) {
            if (err) {
                getTokenCompleteCallback(err);
                return;
            }
            switch(self._userRealm.accountType) {
                case AccountType.Managed:
                    self._getTokenUsernamePasswordManagedWithClientCredentials(username, password, clientSecret, getTokenCompleteCallback);
                    return;
                case AccountType.Federated:
                    self._getTokenUsernamePasswordFederated(username, password, getTokenCompleteCallback);
                    return;
                default:
                    getTokenCompleteCallback(self._log.createError('Server returned an unknown AccountType: ' + self._userRealm.AccountType));
            }
        });
    });
};

AuthenticationContext.prototype.acquireTokenWithUsernamePasswordClientCredentials = function(resource, username, password, clientId, clientSecret, callback)  {
    argument.validateCallbackType(callback);
    try {
      argument.validateStringParameter(resource, 'resource');
      argument.validateStringParameter(username, 'username');
      argument.validateStringParameter(password, 'password');
      argument.validateStringParameter(clientId, 'clientId');
      argument.validateStringParameter(clientId, 'clientSecret');
    } catch(err) {
      callback(err);
      return;
    }
  
    this._acquireToken(callback, function() {
      var tokenRequest = new TokenRequest(this._callContext, this, clientId, resource);
      tokenRequest.getTokenWithUsernamePasswordClientCredentials(username, password, clientSecret, callback);
    });
  };