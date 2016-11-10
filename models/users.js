'use strict'

const mongodb = require('./db');
function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback) {
	let user = {
		name: this.name,
		password: this.password,
		email: this.email
	};
	mongodb.MongoClient.connect(mongodb.url, function(err, db) {
		if(err) {
			return callback(err);
		}

		let collection = db.collection('users');
		collection.insert(user, {safe: true}, function(err, user) {
			db.close();
			if(err) {
				return callback(err);
			}
			callback(null, user[0]);
		});
	});
};

User.get = function(opt, callback) {
	mongodb.MongoClient.connect(mongodb.url, function(err, db) {
		if(err) {
			return callback(err);
		}

		let collection = db.collection('users');
		collection.findOne(opt, function(err, user) {
			db.close();
			if(err) {
				return callback(err);
			}
			callback(null, user);
		});
	});
};

User.getByEmail = function(email, callback) {
	User.get({'email': email}, callback);
}

User.getByName = function(name, callback) {
	User.get({'name': name}, callback);
}