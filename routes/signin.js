var express = require('express');
var router = express.Router();
var checkNotLogin = require('../middleware/check').checkNotLogin;
var User = require('../models/users');
var crypto = require('crypto');

router.get('/', checkNotLogin, function(req, res, next) {
	res.render('signin',{
		title: '登录',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/', checkNotLogin, function(req, res, next) {
	var name = req.body.name;
	var password = req.body.password;
	var md5 = crypto.createHash('md5');

	password = md5.update(password).digest('hex');

	User.getByName(name, function(err, user) {
		if(err) {
			req.flash('error', '登录失败！');
			return res.redirect('/signin');
		}
		if(password != user.password) {
			req.flash('error', '用户名或密码错误！');
			return res.redirect('/signin');
		}
		req.session.user = user;
		req.flash('success', ' 登录成功！');
		res.redirect('/');
	})
})

module.exports = router;