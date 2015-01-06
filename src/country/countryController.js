// List the end points of the country entity.
module.exports = function (app, options) {

    var mongoose = options.mongoose,
        Schema = options.mongoose.Schema,
        db = options.db,
        countryModel = require('./countryModel')(db);

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
                country: country,
                crud: {
                    create: 'POST /country',
                    read: 'GET /country',
                    readyById: 'GET /country/' + country._id,
                    update: 'PUT /country/' + country._id,
                    delete: 'DELETE /country/' + country._id
                }
            });
        });
    });

    // Read all countries.
    app.get('/country', function (req, res) {
        // Mongoose querying via querystring. 
        // Ex: /country?limit=2 or /country?filter={"isoCode":"en"}
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

    // Read a single country record by its _id.
    app.get('/country/:id', function (req, res) {
        countryModel.findById(req.params.id, function (err, country) {
            if (err) {
                return options.handleError(err, req, res, 'Could not find the record.');
            }

            res.send({
                found: country !== null,
                country: country
            });
        });
    });

    // Read all countries matching a given language.
    app.get('/country/lang/:lang', function (req, res) {
        // Filter the result by any provided querystring parameters.
        countryModel.find({
                'names.lang': req.params.lang
            })
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

    // Update a single country record by its _id.
    app.put('/country/:id', function (req, res) {

        countryModel.findById(req.params.id, function (err, country) {
            var updated;

            if (err) {
                return options.handleError(err, req, res, 'Could not find the record to update.');
            }

            updated = req.body;
            updated.updatedAt = Date.now();
            updated.__v = country.__v + 1;

            country.update(
                updated,
                {
                    safe: true,
                    upsert: false,
                    multi: false,
                    overwrite: false
                },
                function (err, numberAffected, raw) {
                    if (err) {
                        return options.handleError(err, req, res, 'Could not update the record.');
                    }

                    res.send({
                        numberAffected: numberAffected,
                        raw: raw,
                        previous: country,
                        updated: req.body
                    });
                }
            );
        });
    });

    // Delete a single country record by its _id.
    app.delete('/country/:id', function (req, res) {
        countryModel.findByIdAndRemove(req.params.id, function (err, country) {
            if (err || !country) {
                return options.handleError(err, req, res, 'Could not delete the record.');
            }

            res.send({
                deleted: true,
                country: country
            });
        });
    });
};
