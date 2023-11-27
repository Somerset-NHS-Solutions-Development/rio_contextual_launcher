const _ = require('lodash');
const queryString = require('querystring');
const aesjs = require('aes-js');
const pbkdf2 = require('pbkdf2');
// const Buffer = require('node:buffer')

// Set Up Logging
const audit = require('../utils/auditlogger.js');
const logger = require('../utils/logger.js');


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
	var queryString = "patient=9435762263&practitioner=Quin.Drakes@somersetft.nhs.uk&token=eyJhbGciOBLAHBLAHBLAH"
	req.query = query;
    next();
  } catch(err) {
    audit.error('Request Query Processing Failure: ' + err);
    logger.error(JSON.stringify(err));
    res.status(401).send('Could not process request query object.');
    res.end();
  }
};
