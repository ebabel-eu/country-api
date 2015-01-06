// List the end points of the country entity.
module.exports = function (app, options) {

	var mongoose = options.mongoose,
	    Schema = options.mongoose.Schema,
	    db = options.db,
        countryModel = require('./countryModel')(db);

	// List all countries.
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

    // Create a new country.
    app.post('/country', function (req, res) {
        var country = new countryModel(req.body);

        country.createdAt = Date.now();

        country.save(function (err) {
            if (err) {
                return options.handleError(err, req, res, 'Could not create the record.');
            }
            
            // Return a successful created flag along with the country record that has been created.
            res.send({
                created: true,
                country: country
            });
        });
    });

};
