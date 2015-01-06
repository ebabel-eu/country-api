module.exports = function (app, options) {

	var mongoose = options.mongoose,
	    Schema = options.mongoose.Schema,
	    db = options.db,
	    countryModel = require('./countryModel')(db);

	// Get a list of all countries.
	app.get('/country/:lang', function (req, res) {
		
	});

};
