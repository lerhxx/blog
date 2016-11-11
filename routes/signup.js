'use strict'

const express = require('express');
const router = express.Router();
const checkNotLogin = require('../middleware/check').checkNotLogin;
const User = require('../models/users');
const crypto = require('crypto');

router.get('/', checkNotLogin, (req, res, next) => {
	res.render('signup', {
		title: '注册',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	})
})

router.post('/', checkNotLogin, (req, res, next) => {
	let name = req.body.name;
	let password = req.body.password;
	let email = req.body.email;

	let md5 = crypto.createHash('md5');
	password = md5.update(password).digest('hex');

	let newUser = new User({
		name: name,
		password: password,
		email: email
	});

	User.getByName(newUser.name, (err, user) => {
		if(err) {
			req.flash('error', '注册失败！');
			return res.redirect('/signup');
		}
		if(user) {
			req.flash('error', '用户名已存在！');
			return res.redirect('/signup');
		}

		newUser.save((err, user) => {
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