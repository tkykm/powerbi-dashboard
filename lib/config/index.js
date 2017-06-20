'use strict'

const fs = require('fs')
const path = require('path')
const {merge} = require('lodash')
const deepFreeze = require('deep-freeze')
const appRootPath = path.join(__dirname, '../../')
const env = process.env.NODE_ENV || 'production'

const configFilePath = path.join(__dirname, '../../config.json')
const fileConfig = fs.existsSync(configFilePath) ? require(configFilePath)[env] : undefined

let config = {}
config.Environment = env
merge(config, fileConfig)
merge(config, require('./environment'))

// maek config readonly
config = deepFreeze(config)

module.exports = config