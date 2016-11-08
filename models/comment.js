var mongodb = require('./db');

function Comment(name, title, comment) {
	this.name = name;
	this.title = title;
	this.comment = comment;
}

module.exports = Comment;

Comment.prototype.save = function(callback) {
	var name = this.name,
		title = this.title,
		comment = this.comment;
	var date = new Date();
	var time = {
		date: date,
		year: date.getFullYear(),
		month: (date.getMonth() + 1),
		day: date.getDate(),
		minute: (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	}

	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('posts', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
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
			})
		})
	})
}