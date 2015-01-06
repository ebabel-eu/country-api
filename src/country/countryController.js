// List the end points of the country entity.
module.exports = function (app, options) {

	var mongoose = options.mongoose,
	    Schema = options.mongoose.Schema,
	    db = options.db,
	    countryGet = require('./countryGet'),
	    countryModel = require('./countryModel')(db);

	// Get a list of all countries.
	app.get('/country', countryGet);
};
