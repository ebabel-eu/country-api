// Mongoose Schema.
var countrySchema = function () {
    var Schema = require('mongoose').Schema;

    return new Schema({
        isoCode: {
            type: String,
            index: true,
            unique: true,
            required: true,
            dropDups: true
        },
        createdAt: Date,
	names: [],
	create: String,	
	read: String,
	readById: String,
	update: String,
	delete: String
    });
};

// Expose the model.
module.exports = function (db) {
    return db.model('country', countrySchema());
};
