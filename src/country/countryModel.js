// Mongoose Schema.
var countrySchema = function () {
    var Schema = require('mongoose').Schema;

    return new Schema({
        isoCode: String,
        createdAt: Date,
	names: []
    });
};

// Expose the model.
module.exports = function (db) {
    return db.model('country', countrySchema());
};
