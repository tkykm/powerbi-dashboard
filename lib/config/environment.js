'use strict'

const {toBooleanConfig} = require('./utils')

module.exports = {
  title: process.env.PB_TITLE,
  clientid: process.env.PB_CLIENT_ID,
  clientsecret: process.env.PB_CLIENT_SECRET,
  dashboardid: process.env.PB_DASHBOARD_ID,
  redirecturl: process.env.PB_REDIRECT_URL,
  usessl: toBooleanConfig(process.env.USESSL)
}