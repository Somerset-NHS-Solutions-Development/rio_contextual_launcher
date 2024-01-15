const logger = require('../utils/logger.js');


module.exports = async (req, res, next) => { 
    req.query["timestamp"] = "2024-01-15T12:46:00.001Z";
    let parsedTimestamp = Date.parse(req.query["timestamp"])
	//5 minutes
	parsedTimestamp += parseInt(process.env.expirationLength)
	const date = new Date().toJSON();
	let parsedDate = Date.parse(date)
	logger.debug("Current Date: " + date + " Timestamp: " + parsedTimestamp)

		
	if (parsedDate < parsedTimestamp) {		
        logger.debug("Within Bounds")
		next();
	}	
		
	else {
        logger.debug("Out of Bounds")
		res.status(408).send("Token Expired");
		res.end();
	}
};