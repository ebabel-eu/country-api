module.exports = function (app, options) {

	// List all entities, one per variable. Each entity has a controller.
	var country;

	options.handleError = function (err, req, res, msg) {
		res.send({
			error: err,
			url: req.url,
			method: req.method,
			msg: msg
		});
	};

	country = require('./country/countryController.js')(app, options);
};
