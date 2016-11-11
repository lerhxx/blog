'use strict'

const express = require('express');
const app = express();
const router = express.Router();
const crypto = require('crypto'),
	User = require('../models/users.js'),
	Post = require('../models/posts.js'),
	Comment = require('../models/comment.js');

module.exports = app => {
	app.get('/', (req, res) => {
		let page = parseInt(req.query.p) || 1;
		let email = req.session.user ? req.session.user.email : null;
		Post.getAll(page, (err, posts, total) => {
			if(err) {
				posts = [];
			}
			res.render('index', {
				title: '主页',
				posts: posts,
				page: page,
				isFirstPage: (page - 1) == 0,
				isLastPage: ((page - 1) * 10 + posts.length) == total,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				email: req.flash('email').toString()
			});
		})
	});

	app.use('/signin', require('./signin'));
	app.use('/signup', require('./signup'));
	app.use('/signout', require('./signout'));
	app.use('/posts', require('./posts'));



	// app.get('/upload', checkLogin);
	// app.get('/upload', function(req, res) {
	// 	res.render('upload', {
	// 		title: '文件上传',
	// 		user: req.session.user,
	// 		success: req.flash('success').toString(),
	// 		error: req.flash('error').toString()
	// 	});
	// });

	// app.post('/upload', checkLogin);
	// app.post('/upload', upload.array('field1', 5), function(req, res) {
	// 	req.flash('success', '文件上传成功！');
	// 	res.redirect('/upload');
	// })


};
