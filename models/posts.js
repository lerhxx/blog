'use strict'

const mongodb = require('./db');
const markdown = require('marked');

markdown.setOptions({
	highlight: code => require('highlight.js').highlightAuto(code).value
})


class Post {
	constructor(name, title, tag, abstract, content) {
		this.name = name;
		this.title = title;
		this.tag = tag;
		this.abstract = abstract;
		this.content = content;
	}

	save(callback) {
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
			tag: this.tag,
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
	}

	static getTen(opt, page, callback) {
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
						doc.content = markdown(doc.content);
					});
					callback(null, docs, total);
				});
			});
		});
	}

	static getAllByEmail(email, page, callback) {
		this.getTen({email: email}, page, callback);
	}

	static getAllByName(name, page, callback) {
		this.getTen({name: name}, page, callback);
	}

	static getAll(page, callback) {
		this.getTen({}, page, callback);
	}

	static getOne(title, callback) {
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
					doc.content = markdown(doc.content);
					doc.comments.forEach(comment => {
						doc.content = markdown(doc.content);
					});
				};
				callback(null, doc);
			});
		});
	}

	static edit(name, title, callback) {
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
	}

	static update(name, title, content, callback) {
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
	}

	static remove(name, title, callback) {
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
	}
}


module.exports = Post;

