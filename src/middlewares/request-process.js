const crypto = require('node:crypto');

// Set Up Logging
const audit = require('../utils/auditlogger.js');
const logger = require('../utils/logger.js');
const { parseArgs } = require('util');
const { json } = require('body-parser');


module.exports = async (req, res, next) => {
  logger.debug('Checking downstream auth reqs');
  try {
	logger.system("query:" + JSON.stringify(req.query));
	let cipher = "";
	for(let key in req.query) {
		cipher = key;
		break;
	};
	
	logger.system('cipher: ' + cipher);
	var key = Buffer.from(process.env.eprportal_rio_encryption_key);
	var encrypted = Buffer.from(cipher, 'base64');
	var decipher = crypto.createDecipheriv("aes-128-ecb", key, '')
	decipher.setAutoPadding(false)
	var result = decipher.update(encrypted).toString('hex');
	result += decipher.final().toString('hex');

	logger.system("cryto: " + result);
	logger.system("utf8: " + Buffer.from(result, 'hex').toString('utf8'));

	
	let keyVal = "";
	let keyArray = [];
	let query = {};
	var queryString = Buffer.from(result, 'hex').toString('utf8');
	
	keyVal = queryString.split('&');
	// logger.system('Key Value:' + JSON.stringify(keyVal));
	for(let set in keyVal) {
		keyArray.push(keyVal[set].split('='));
	};
	// logger.system('Keys:' + JSON.stringify(keyArray));
	for (let i in keyArray) {
		// logger.system('Values:' + JSON.stringify(keyArray[i]));
		query[keyArray[i][0]] = keyArray[i][1];
	};
	logger.system('results: ' + JSON.stringify(query));

	req.query = query;
    next();
  } catch(err) {
    audit.error('Request Query Processing Failure: ' + err);
    logger.error(JSON.stringify(err));
    res.status(401).send('Could not process request query object.');
    res.end();
  }
};
