const crypto = require('node:crypto');

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
	logger.system('cipher: ' + cipher);
	var key = Buffer.from('insecurepassword');
	var encrypted = Buffer.from(cipher, 'base64');
	decipher = crypto.createDecipheriv("aes-128-ecb", key, '')
	decipher.setAutoPadding(false)
	result = decipher.update(encrypted).toString('hex');
	result += decipher.final().toString('hex');

	logger.system("cryto: " + result);
	logger.system("utf8: " + Buffer.from(result, 'hex').toString('utf8'));


	
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
