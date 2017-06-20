'use strict'

const config = require('../config')
var AuthenticationContext = require('adal-node').AuthenticationContext;

var tenant = 'common'
var authorityHostUrl = 'https://login.windows.net'
var authorityUrl = authorityHostUrl + '/' + tenant;
var resource = 'https://analysis.windows.net/powerbi/api';
var TOKEN=''
var REFLESH_TOKEN=''
var authenticationContext = new AuthenticationContext(authorityUrl);

module.exports = function(res, req, mode='init', response={}){

    if(mode === 'regist'){
        TOKEN = response.accessToken
        REFLESH_TOKEN = response.refreshToken
        if (process.env.NODE_ENV == 'development'){
            console.log(TOKEN)
            console.log()
            console.log(REFLESH_TOKEN)
        }
        return
    }
    if(TOKEN === ''){
        res.redirect('/initialize')
    }
    else{
        let tokenarray = TOKEN.split('.')
        let claim = new Buffer(tokenarray[1], 'base64').toString()
        claim = JSON.parse(claim)
        if(claim.exp < (new Date().getTime() / 1000)){
            if(REFLESH_TOKEN === ''){
                res.redirect('/initialize') 
            }
            else{
                TOKEN = null
                authenticationContext.acquireTokenWithRefreshToken(REFLESH_TOKEN, config.clientid, config.clientsecret, resource, function(refreshErr, refreshResponse) {
                    if (refreshErr) {
                        console.log('refreshError: ' + refreshErr.message + '\n')
                        res.redirect('/initialize')
                        return null
                    }
                    TOKEN = refreshResponse.accessToken
                    REFLESH_TOKEN = refreshResponse.refreshToken
                    if (process.env.NODE_ENV == 'development'){
                        console.log('done acquireTokenWithRefreshToken')
                        console.log(TOKEN)
                        console.log()
                        console.log(REFLESH_TOKEN)
                    }
                    res.redirect(307, req.url); // 307 which indicates that the request should be repeated using the same method and post data
                });
                return null
            }
        }else{
            return TOKEN
        }
    }
    return null
}