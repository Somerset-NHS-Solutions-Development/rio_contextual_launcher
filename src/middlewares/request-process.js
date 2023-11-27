const _ = require('lodash');
const queryString = require('querystring');
const aesjs = require('aes-js');
const pbkdf2 = require('pbkdf2');
// const Buffer = require('node:buffer')

// Set Up Logging
const audit = require('../utils/auditlogger.js');
const logger = require('../utils/logger.js');
const { parseArgs } = require('util');
const { json } = require('body-parser');


module.exports = async (req, res, next) => {
  logger.debug('Checking downstream auth reqs');
  try {
	logger.system("query:" + JSON.stringify(req.query));
	let query = {};
	let cipher = "";
	for(let key in req.query) {
		cipher = key;
		break;
	};
	// logger.system('cipher: ' + cipher);
	// const cipherB = aesjs.utils.utf8.toBytes(cipher);
	// let key = pbkdf2.pbkdf2Sync("insecurepassword", "salt", 1, 128/8, "sha256");
	// let aesECB = new aesjs.ModeOfOperation.ecb(key);
	// logger.system("mode set");
	// let decryptB = aesECB.decrypt(cipherB);
	// logger.system("decryptB: " + decryptB);
	// let decrypt = aesjs.utils.hex.fromBytes(decryptB)
	// logger.system('DecryptB64:' + decrypt);
	// let buff = Buffer.from(decrypt, "base64");
	// logger.system('utf8:' + buff.toString("utf-8"));
	let keyVal = "";
	let keyArray = [];
	let result = {};
	var queryString = "patient=9435762263&practitioner=Quin.Drakes@somersetft.nhs.uk&token=eyJhbGciOBLAHBLAHBLAH";
	
	keyVal = queryString.split('&');
	// logger.system('Key Value:' + JSON.stringify(keyVal));
	for(let set in keyVal) {
		keyArray.push(keyVal[set].split('='));
	};
	// logger.system('Keys:' + JSON.stringify(keyArray));
	for (let i in keyArray) {
		// logger.system('Values:' + JSON.stringify(keyArray[i]));
		result[keyArray[i][0]] = keyArray[i][1];
	};
	logger.system('results: ' + JSON.stringify(result));
	

	req.query = query;
    next();
  } catch(err) {
    audit.error('Request Query Processing Failure: ' + err);
    logger.error(JSON.stringify(err));
    res.status(401).send('Could not process request query object.');
    res.end();
  }
};
