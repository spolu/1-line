
var fwk = require('fwk');
var config = fwk.baseConfig(); 

config['L1_DYNAMODB_ACCESSKEYID'] = 'dummy';
config['L1_DYNAMODB_SECRETACCESSKEY'] = 'dummy';
config['L1_DYNAMODB_TABLE'] = 'l1-users'

exports.config = config;
