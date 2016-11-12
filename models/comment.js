'use strict'

const mongodb = require('./db');

class Comment {
	constructor(name, title, comment) {
		this.name = name;
		this.title = title;
		this.comment = comment;
	}

	save(callback) {
		let name = this.name,
			title = this.title,
			comment = this.comment;
		let date = new Date();
		let time = {
			date: date,
			year: date.getFullYear(),
			month: (date.getMonth() + 1),
			day: date.getDate(),
			minute: (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
		}

		mongodb.MongoClient.connect(mongodb.url, (err, db) => {
			if(err) {
				return callback(err);
			}
			let collection = db.collection('posts');
			collection.update({
				"name": name,
				"title": title
			},{
				$push: {"comments": comment}
			}, function(err) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				callback(null);
			});
		});
	}
}

module.exports = Comment;
