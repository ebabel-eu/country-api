module.exports = {

	// Ten years. 864e5 is the number of miliseconds in one day, i.e. 86400000.
	expiryDate: 864e5 * 365.2425 * 10,

    // Default ports to listen on with a Nitrous virtual machine.
	port: 3000,

    // On a Nitrous virtual machine, publishing to the ip 0.0.0.0 makes it available to the outside world.
	ip: '0.0.0.0',

    // On a Nitrous virtual machine, default address of mongo database.
    mongodb: 'mongodb://127.0.0.1:27017/countryapi'

};
