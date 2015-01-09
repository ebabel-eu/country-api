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


## Notes

Country codes: http://en.wikipedia.org/wiki/ISO_3166-1
