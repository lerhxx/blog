'use strict'

const mongodb = require('./db'),
	markdown = require('markdown').markdown;

function Post(name, title, abstract, content) {
	this.name = name;
	this.title = title;
	this.abstract = abstract;
	this.content = content;
}

module.exports = Post;

Post.prototype.save = (callback) => {
	let date = new Date();

	let time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + '-' + (date.getMonth() + 1),
		day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
		minute: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	}

	let post = {
		name: this.name,
		time: time,
		title: this.title,
		abstract: this.abstract,
		content: this.content,
		like: 0,
		comments: []
	}

	mongodb.MongoClient.connect(mongodb.url, (err, db) => {
		if(err) {
			return callback(err);
		}
		let collection = db.collection('posts');
		collection.insert(post, {safe: true}, err => {
			db.close();
			if(err) {
				return callback(err);
			}
			callback(null);
		});
	});
};

Post.getTen = (opt, page, callback) => {
	mongodb.MongoClient.connect(mongodb.url, (err, db) => {
		if(err) {
			return callback(err);
		}

		let collection = db.collection('posts');
		collection.count(opt, (err, total) => {
			collection.find(opt, {
				skip: (page - 1) * 10,
				limit: 10
			}).sort({
				time: -1
			}).toArray((err, docs) => {
				db.close();
				if(err) {
					return callback(err);
				}
				docs.forEach(doc => {
					doc.content = markdown.toHTML(doc.content);
				});
				callback(null, docs, total);
			});
		});
	});
};

Post.getAllByEmail = (email, page, callback) => Post.getTen({'email': email}, page, callback);

Post.getAllByName = (name, page, callback) => Post.getTen({'name': name}, page, callback);

Post.getAll = (page, callback) => Post.getTen({}, page, callback);

Post.getOne = (title, callback) => {
	mongodb.MongoClient.connect(mongodb.url, (err, db) => {
		if(err) {
			return callback(err);
		}

		let collection = db.collection('posts');
		collection.findOne({"title":title}, (err, doc) => {
			db.close();
			if(err) {
				return callback(err);
			}
			if(doc){
				doc.content = markdown.toHTML(doc.content);
				doc.comments.forEach(comment => {
					comment.content = markdown.toHTML(comment.content);
				});
			};
			callback(null, doc);
		});
	});
}

Post.edit = (name, title, callback) => {
	mongodb.MongoClient.connect(mongodb.url, (err, db) => {
		if(err) {
			return callback(err);
		}

		let collection = db.collection('posts');
		collection.findOne({
			"name": name,
			"title": title
		}, (err, doc) => {
			db.close();
			if(err) {
				return callback(err);
			}
			callback(null, doc);
		});
	});
};

Post.update = (name, title, content, callback) => {
	mongodb.MongoClient.connect(mongodb.url, (err, db) => {
		if(err) {
			return callback(err);
		}
		let collection = db.collection('posts');
		collection.update({
			"name": name,
			"title": title
		}, {$set:{content: content}}, err => {
			db.close();
			if(err) {
				return callback(err);
			}
			callback(null);
		});
	});
};

Post.remove = (name, title, callback) => {
	mongodb.MongoClient.connect(mongodb.url, (err, db) => {
		if(err) {
			return callback(err);
		}

		let collection = db.collection('posts');
		collection.remove({
			"name": name,
			"title": title
		}, {w: 1}, (err) => {
			db.close();
			if(err) {
				return callback(err);
			}
			callback(null);
		});
	});
};