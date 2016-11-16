'use strict'

const mongodb = require('./db');
const fs = require('fs');
const form = require('formidable');

let avaUrl = 'images/default.jpg';

class User {
	constructor(name, password, email, avatar=avaUrl) {
		this.name = name;
		this.password = password;
		this.email = email;
		this.avatar = avatar;
	}

	save(callback) {
		let user = {
			name: this.name,
			password: this.password,
			email: this.email,
			avatar: this.avatar
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
				callback(null);
			});
		});
	}

	saveAvatar(avatar, callback) {
		let user = {
			name: this.name,
			password: this.password,
			email: this.email,
			avatar: this.avatar
		};
console.log('3');
		// mongodb.MongoClient.connect(mongodb.url, (err, db) => {
		// 	if(err) {
		// 		return callback(err);
		// 	}
		// 	console.log('4');
		// 	let collection = db.collection('users');
		// 	collection.update({
		// 		"name": user.name
		// 	}, {$set: {"avatar": avatar}}, {safe: true}, (err, user) => {
		// 		db.close();
		// 		if(err) {
		// 			return callback(err);
		// 		}
		// 		console.log('5');
		// 		callback(null);
		// 	});
		// });
		// callback(null);
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

