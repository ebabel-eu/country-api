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
        names: []   // Ex: [ {lang: 'en', name: 'Netherlands (the)'}, {lang: 'nl', name: 'Nederland'} ]
    });
};

// Expose the model.
module.exports = function (db) {
    return db.model('country', countrySchema());
};
