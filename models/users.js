'use strict'

const mongodb = require('./db');

class User {
	constructor(name, password, email) {
		this.name = user.name;
		this.password = user.password;
		this.email = user.email;
	}

	save(callback) {
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
	}

	static get(opt, callback) {
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
	}

	static getByEmail(email, callback) {
		this.get({email: email}, callback);
	}

	static getByName(name, callback) {
		this.get({name: name}, callback);
	}
}

module.exports = User;

