'use strict'

const express = require('express');
const router = express.Router();
const checkLogin = require('../middleware/check').checkLogin;
const fs = require('fs');
const formidable = require('formidable');
const User = require('../models/users');

router.get('/', checkLogin, (req, res, next) => {
	res.render('info',{
		title: '个人信息',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});
router.post('/', checkLogin, (req, res, next) => {
	let form = new formidable.IncomingForm();
	form.uploadDir = './uploads';
	form.keepExtensions = true;

	let user = req.session.user;
	let newUser = new User({
		name: user.name,
		password: user.password,
		email: user.email,
		avatar: user.avatar
	});
	form.parse(req, (err, fields, files) => {
		if(err) {
			req.flash('error', err);
			return res.redirect('/info');
		}
		let pathname = files.avatar.path;
		console.log('2');
		newUser.saveAvatar(pathname, (err) => {
			if(err) {
				req.flash('error', '上传失败！');
				return res.redirect('/info');
			}
			req.flash('success', '上传成功！');
			res.redirect('/');
		});
		console.log('1');
	})
})

module.exports = router;