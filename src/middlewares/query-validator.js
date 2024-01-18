const { format } = require('winston');
const logger = require('../utils/logger.js');


module.exports = async (req, res, next) => { 
    console.log("Timestamp value: " + req.query["timestamp"]);
    if(!req.query["timestamp"]) {
	res.status(400).send("Could not validate time of request").end();
	return;
    }

    if (req.query["timestamp"].length > 19) {
        req.query["timestamp"] = req.query["timestamp"].substring(0, 19);
    }
    
    if (req.query["timestamp"].includes("/")) {
        // Takes day, month + "/", year, and other from timestamp
        day = req.query["timestamp"].substring(0, 2);
        month = req.query["timestamp"].substring(2, 6);
        year = req.query["timestamp"].substring(6, 10);
        other = req.query["timestamp"].substring(10, 19);
        let formattedTimestamp = year + month + day + other;
	logger.debug('Current format: ' + formattedTimestamp);
        formattedTimestamp = formattedTimestamp.replace(/\//g, "-");
        formattedTimestamp = formattedTimestamp.replace(" ", "T");
        req.query["timestamp"] = formattedTimestamp;
    };


    let workDate = new Date(req.query["timestamp"]);
    let parsedTimestamp = Date.parse(workDate);
	//5 minutes
	parsedTimestamp += parseInt(process.env.expirationLength);
	const date = new Date().toJSON();
	let parsedDate = Date.parse(date);
	logger.debug("Current Date: " + parsedDate + " Timestamp: " + parsedTimestamp);

		
	if (parsedDate < parsedTimestamp) {		
        logger.debug("Within Bounds");
        next();
	}	
		
	else {
        logger.debug("Out of Bounds");
		res.status(408).send("Token Expired");
		res.end();
	}
};
