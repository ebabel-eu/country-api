# NodeJS CRUD API
Workshop for NodeJS CRUD operations on an entity with a RESTful web API

## Introduction

### What are we building?

We are going to build a NodeJS web API that runs CRUD operations on a single entity: a globalized list of countries.

### How do we work?

We run this workshop in a https://www.nitrous.io/ virtual machine, to quickly get up to speed with our development environment.

Git is used to checkout each step of building our web API together.

The starting point is an almost empty "master" branch.

The final result we are aiming for is in the "final-solution" branch.

Your code is to be commited in your local repository but not pushed to the remote repository.

### Why is this project interesting?

When DEV is not ready to deliver a web API, you can quickly make one for your development environment.

If we build a custom web app that doesn't use a CMS and relies on a thick front-end UI, you are free to develop your own web services API.


## Installation

* Create a NodeJS virtual machine on https://www.nitrous.io/
* In Chrome, install the Advanced Rest Client app: chrome-extension://hgmloofddffdnphfgcellkdfbfbjeloo/RestClient.html
* Open a console command line on the Nitrous virtual machine
* Change your directory to ~/worspace
```
git clone https://github.com/ebabel-eu/country-api.git
```
* Install MongoDB
```
 parts install mongodb
 parts start mongodb
```

## Step 1

```
git checkout step-1
```

In step 1 we install our dependencies with npm, the Node Package Manager.

Install your dependencies from the command line:

```
npm install express --save
npm install body-parser --save
npm install mongoose --save
```

Now you can see your package.json has been updated with vi package.json and your dependencies have been installed in a node_modules directory.

## Step 2

```
git checkout step-2
```

A config.js has been added. It lists the configuration values of your app in a given environment (port, ip and database address) and useful global values like the expiryDate.

A server.js has also been added. This is the starting point of your server side code.

Let's take a moment to run through this code and understand what it does.

## Step 3

```
git checkout step-3
```

Let's create our source code in the src director:

```
mkdir src
```

Add the main file of our API:

```
touch src/api.js
```

Edit the api.js file with vi:

```
vi src/api.js
```

Press the i key to insert your code (you can copy paste with CTRL SHIFT V):

```
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
```

Save your code with the ESC key followed by :wq and the ENTER key.

Let's now discuss the code we have written.

## Step 4

```
git checkout step-4
```

We will now add our controller and model in the country directory.

```
mkdir src/country
touch src/country/countryController.js
touch src/country/countryModel.js
```

In the controller, let's write the basic version of our API without any endpoint yet.

```
vi src/country/countryController.js
```

```
// List the end points of the country entity.
module.exports = function (app, options) {

    var mongoose = options.mongoose,
        Schema = options.mongoose.Schema,
        db = options.db,
        countryModel = require('./countryModel')(db);
};
```

Now is a good time to discuss the controller.

The model is now to be added:

```
vi src/country/countryModel.js
```

```
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
        updatedAt: Date,
        names: []
    });
};

// Expose the model.
module.exports = function (db) {
    return db.model('country', countrySchema());
};
```

Let's discuss the country model.

## Step 5

```
git checkout step-5
```

In step 5, we will edit the controller to add 6 endpoints:

```
vi src/country/countryController.js
```

Insert the following code after "countryModel = require('./countryModel')(db);" and before the final "};"

```
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
        // Ex: /country?limit=2, /country?filter={"isoCode":"gb"} or /country/?filter={"names.lang": "nl"}
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
                // Find any country that has a name entry with the matching language.
                'names.lang': req.params.lang
            }, {
                // Exclude fields below:
                _id: 0,
                createdAt: 0,
                __v: 0,
                updatedAt: 0
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
```

Let's go through together each other these end points

## Step 6

You can now run your API with the following command and test it by browsing to your virtual machine address with the Chrome app Advanced Rest Client.

```
node server.js
```

Now try all CRUD operations:

* Creating new country records
* Reading what you have created
* Updating one record
* Deleting one record


## Stretch objectives:

* Add a new "users" entity with CRUD operations similar to the country entity.
* Discuss how to build an app that would make use of this kind of API.

## Notes

Country codes: http://en.wikipedia.org/wiki/ISO_3166-1
