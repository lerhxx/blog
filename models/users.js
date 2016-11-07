var mongodb = require('./db');
function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback) {
	var user = {
		name: this.name,
		password: this.password,
		email: this.email
	};
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}

		db.collection('users', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}

			collection.insert(user, {
				safe: true
			}, function(err, user) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				callback(null, user[0]);
			});
		});
	});
};

User.get = function(opt, callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne(opt, function(err, user) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				callback(null, user);
			});
		});
	});
};

User.getByEmail = function(email, callback) {
	User.get({'email': email}, callback);
}

User.getByName = function(name, callback) {
	User.get({'name': name}, callback);
}