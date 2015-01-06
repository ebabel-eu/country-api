// List the end points of the country entity.
module.exports = function (app, options) {

	var mongoose = options.mongoose,
	    Schema = options.mongoose.Schema,
	    db = options.db,
	    countryModel = require('./countryModel')(db);

	// Get a list of all countries.
	app.get('/country', function (req, res) {
        // Mongoose querying via querystring. 
        // Ex: append ?limit=2 or ?filter={"id": "de"}
        var qSkip = req.query.skip,
            qLimit = req.query.limit,
            qSort = req.query.sort,
            qFilter = req.query.filter ? JSON.parse(req.query.filter) : {};

        // Filter the result by any provided querystring parameters.
        countryModel.find(qFilter)
            .sort(qSort)
            .skip(qSkip)
            .limit(qLimit)
            .exec(function (err, country) {
                if (err) {
                    // Return an error message if a valid response couldn't be formulated.
                    return options.handleError(err, req, res, 'Could not list the records.');
                }

                // Return a valid response.
                res.send({
                    records: country.length,
                    country: country
                });
            });
	});
};
