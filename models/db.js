// var settings = require('../settings'),
// 	Db = require('mongodb').Db,
// 	Connection = require('mongodb').Connection,
// 	Server = require('mongodb').Server;

// module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});

var url = 'mongodb://x_x:123456@ds149207.mlab.com:49207/myblog';
var MongoClient = require('mongodb').MongoClient;

module.exports = {
	MongoClient: MongoClient,
	url: url
}