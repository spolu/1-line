
var fwk = require('fwk');
var config = fwk.baseConfig(); 

config['LAYER43_SECRET'] = '05c2f6c061dbb312f6a394af44d474fc';

//config['LAYER43_DYNAMODB_ACCESSKEYID'] = 'AKIAIATTLQXGUB6C4OWA';
//config['LAYER43_DYNAMODB_SECRETACCESSKEY'] = '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';

config['LAYER43_REDIS_HOST'] = 'perch.redistogo.com';
config['LAYER43_REDIS_PORT'] = 9863;
config['LAYER43_REDIS_AUTH'] = 'c2c4537c7a0c23b040d13855ff7d01cb';

config['LAYER43_SENDGRID_HOST'] = 'smtp.sendgrid.net';
config['LAYER43_SENDGRID_PORT'] = '587';
config['LAYER43_SENDGRID_USER'] = 'carbondraft';
config['LAYER43_SENDGRID_PASS'] = 'id2wgsf4';
config['LAYER43_SENDGRID_FROM'] = 'CarbonDraft::Office <office@carbondraft.cc>';

config['LAYER43_COOKIE_AGE'] = 1000 * 60 * 60 * 24 * 365;

exports.config = config;

