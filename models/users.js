'use strict'

const mongodb = require('./db');
function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

User.prototype.save = callback => {
	let user = {
		name: this.name,
		password: this.password,
		email: this.email
	};
	mongodb.MongoClient.connect(mongodb.url, (err, db) => {
		if(err) {
			return callback(err);
		}

		let collection = db.collection('users');
		collection.insert(user, {safe: true}, (err, user) => {
			db.close();
			if(err) {
				return callback(err);
			}
			callback(null, user[0]);
		});
	});
};

User.get = (opt, callback) => {
	mongodb.MongoClient.connect(mongodb.url, (err, db) => {
		if(err) {
			return callback(err);
		}

		let collection = db.collection('users');
		collection.findOne(opt, (err, user) => {
			db.close();
			if(err) {
				return callback(err);
			}
			callback(null, user);
		});
	});
};

User.getByEmail = (email, callback) => User.get({'email': email}, callback);

User.getByName = (name, callback) => User.get({'name': name}, callback);