var express = require('express');
var router = express.Router();
var checkNotLogin = require('../middleware/check').checkNotLogin;
var User = require('../models/users');
var crypto = require('crypto');

router.get('/', checkNotLogin, function(req, res, next) {
	res.render('signup', {
		title: '注册',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	})
})

router.post('/', checkNotLogin, function(req, res, next) {
	var name = req.body.name;
	var password = req.body.password;
	var email = req.body.email;

	var md5 = crypto.createHash('md5');
	password = md5.update(password).digest('hex');
	var newUser = new User({
		name: name,
		password: password,
		email: email
	});

	User.getByName(newUser.name, function(err, user) {
		if(err) {
			req.flash('error', '注册失败！');
			return res.redirect('/signup');
		}
		if(user) {
			req.flash('error', '用户名已存在！');
			return res.redirect('/signup');
		}

		newUser.save(function(err, user) {
			if(err) {
				req.flash('error', '失败！');
				res.redirect('/signup');
			}
			req.session.user = newUser;
			req.flash('success', '注册成功！');
			res.redirect('/');
		});
	});
});

module.exports = router;