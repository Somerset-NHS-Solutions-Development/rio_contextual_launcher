const jwt = require('jsonwebtoken');
const _ = require('lodash');

const jwksClient = require('jwks-rsa');

// Set Up Logging
const audit = require('./../utils/auditlogger.js');
const logger = require('./../utils/logger.js');

const apiKeys = process.env.apiKeys.split(',').map(a => {
  return a.trim();
});

async function getSigningKey(token) {
	return new Promise((resolve, reject) => {
		const client = jwksClient({
			strictSsl: true, // Default value
			jwksUri: (process.env.jwksUri)
		});
		const decoded = jwt.decode(token, {complete: true});
		client.getSigningKey(decoded.header.kid, (err, key) => {
			if(err) {
				logger.error(JSON.stringify(err));
				reject(err);
			} else {
				const signingKey = key.publicKey || key.rsaPublicKey;
				resolve(signingKey);
			}
		});
	});
}

module.exports = async (req, res, next) => {
    logger.debug('Validating Tokens...');
    try {
      logger.debug('Headers: ' + JSON.stringify(req.headers, null, 4));

  		if(!req.headers.authorization && !req.headers['x-api-key'] ) {
  			throw new Error("No authorization headers found");
  		}

  		if(process.env.xAPIKeyEnabled.trim().toLowerCase() === 'true' && req.headers['x-api-key']) {
  			logger.auth(JSON.stringify(apiKeys));
  			const apiKey = req.headers['x-api-key'].trim();
  			if(apiKey.length == 36 && apiKeys.indexOf(apiKey) > -1){
  				audit.info(`Audit Success: X-API-KEY ${apiKey}`);
  				next();
  				return;
  			} else {
  				throw new Error(`API Key not valid ${apiKey}`);
  			}
  		}
    } catch (err) {
			audit.error(`Audit Failure: ${JSON.stringify(err)}`);
			logger.error(JSON.stringify(err));
	    res.status(401).send("Authorisation failed. Either you do not have the right permissions or you'll need to close this panel and try again.");
		    res.end();
    }
}
