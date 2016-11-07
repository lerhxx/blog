var express = require('express');
var app = express();
var router = express.Router();
var crypto = require('crypto'),
	User = require('../models/users.js'),
	Post = require('../models/posts.js'),
	Comment = require('../models/comment.js');
// var upload = require('../models/multerUtil.js');
// var checkLogin = require('../middleware/check').checkLogin;
// var checkNotLogin = require('../middleware/check').checkNotLogin;

module.exports = function(app) {
	app.get('/', function(req, res) {
		var page = parseInt(req.query.p) || 1;
		var email = req.session.user ? req.session.user.email : null;
		Post.getAll(page, function(err, posts, total) {
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

	// app.get('/signup', checkNotLogin);
	// app.get('/signup', function(req, res) {
	// 	res.render('signup', {
	// 		title: '注册',
	// 		user: req.session.user,
	// 		success: req.flash('success').toString(),
	// 		error: req.flash('error').toString()
	// 	});
	// });

	// app.post('/signup', checkNotLogin);
	// app.post('/signup', function(req, res){
	// 	var name = req.body.name,
	// 		password = req.body.password,
	// 		email = req.body.email;

	// 	var md5 = crypto.createHash('md5'),
	// 		password = md5.update(req.body.password).digest('hex');
		
	// 	var newUser = new User({
	// 		name: name,
	// 		password: password,
	// 		email: email
	// 	});

	// 	User.getByEmail(newUser.email, function(err, user) {
	// 		if(err) {
	// 			req.flash('error', err);
	// 			return res.redirect('/');
	// 		}
	// 		if(user) {
	// 			req.flash('error', '该邮箱已注册！');
	// 			return res.redirect('/signup');
	// 		}
	// 		newUser.save(function(err, user) {
	// 			if(err) {
	// 				req.flash('error', err);
	// 				return res.redirect('/signup')
	// 			}
	// 			req.session.user = newUser;
	// 			req.flash('success', '注册成功！');
	// 			res.redirect('/');
	// 		});
	// 	});
	// });

	// app.get('/signin', checkNotLogin);
	// app.get('/signin', function(req, res) {
	// 	res.render('signin', {
	// 		title: '登录',
	// 		user: req.session.user,
	// 		success: req.flash('success').toString(),
	// 		error: req.flash('error').toString()
	// 	});
	// });

	// app.post('/signin', checkNotLogin);
	// app.post('/signin', function(req, res) {
	// 	var md5 = crypto.createHash('md5'),
	// 		password = md5.update(req.body.password).digest('hex');

	// 	User.getByEmail(req.body.email, function(err, user){
	// 		if(!user) {
	// 			req.flash('error', '用户不存在！');
	// 			return res.redirect('/signin');
	// 		}
	// 		if(user.password != password) {
	// 			req.flash('error', '密码错误！');
	// 			return res.redirect('/signin');
	// 		}
	// 		req.session.user = user;
	// 		req.flash('success', '登录成功！');
	// 		res.redirect('/');
	// 	})
	// });

	// app.get('/post', checkLogin);
	// app.get('/post', function(req, res) {
	// 	res.render('post', {
	// 		title: '发表',
	// 		user: req.session.user,
	// 		success: req.flash('success').toString(),
	// 		error: req.flash('error').toString()
	// 	});
	// });
	// app.post('/post', checkLogin);
	// app.post('/post', function(req, res) {
	// 	var currentUser = req.session.user,
	// 		post = new Post(currentUser.name, req.body.title, req.body.post, currentUser.email);
	// 	post.save(function(err) {
	// 		if(err) {
	// 			req.flash('error', err);
	// 			return res.redirect('/post');
	// 		}
	// 		req.flash('success', '发表成功！');
	// 		res.redirect('/');
	// 	});
	// });
	// app.get('/signout', function(req, res){
	// 	req.session.user = null;
	// 	req.flash('success', '登出成功！');
	// 	res.redirect('/');
	// });

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

	// app.get('/u/:name', function(req, res) {
	// 	var page = parseInt(req.query.p) || 1;
	// 	User.getByName(req.params.name, function(err, user) {
	// 		if(!user) {
	// 			req.flash('error', '用户不存在！');
	// 			return res.redirect('/');
	// 		}
	// 		Post.getAllByName(user.name, page, function(err, posts, total) {
	// 			if(err) {
	// 				req.flash('error', err);
	// 				return res.redirect('/');
	// 			}
	// 			res.render('user', {
	// 				title: user.name,
	// 				posts: posts,
	// 				isFirstPage: (page - 1) == 0,
	// 				isLastPage: ((page - 1) * 10 + post.length) == total,
	// 				user: req.session.user,
	// 				success: req.flash('success').toString(),
	// 				error: req.flash('error').toString()
	// 			});
	// 		});
	// 	});
	// });

	// app.get('/u/:name/:title', function(req, res) {
	// 	Post.getOne(req.params.name, req.params.title, function(err, post) {
	// 		if(err) {
	// 			req.flash('error', err);
	// 			return res.redirect('/');
	// 		}
	// 		res.render('article', {
	// 			title: req.params.title,
	// 			post: post,
	// 			user: req.session.user,
	// 			success: req.flash('success').toString(),
	// 			error: req.flash('error').toString(),
	// 		});
	// 	});
	// });

	// app.post('/u/:name/:title', function(req, res) {
	// 	var date = new Date(),
	// 		time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? 0 + date.getMinutes() : date.getMinutes());
	// 	var comment = {
	// 		name: req.body.name,
	// 		email: req.body.email,
	// 		website: req.body.website,
	// 		time: time,
	// 		content: req.body.content
	// 	};
	// 	var newComment = new Comment(req.params.name, req.params.title, comment);
	// 	newComment.save(function(err) {
	// 		if(err) {
	// 			req.flash('error', err);
	// 			return res.redirect('back');
	// 		}
	// 		req.flash('success','留言成功！');
	// 		res.redirect('back');
	// 	});
	// });

	// app.get('/edit/:name/:title', checkLogin);
	// app.get('/edit/:name/:title', function(req, res) {
	// 	var currentUser = req.session.user;
	// 	Post.edit(currentUser.name, req.params.title, function(err, post) {
	// 		if(err) {

	// 			req.flash('error', err);
	// 			return res.redirect('back');
	// 		}
	// 		res.render('edit', {
	// 			title: '编辑',
	// 			post: post,
	// 			user: req.session.user,
	// 			success: req.flash('success').toString(),
	// 			error: req.flash('error').toString()
	// 		});
	// 	});
	// });

	// app.post('/edit/:name/:title', checkLogin);
	// app.post('/edit/:name/:title', function(req, res) {
	// 	var currentUser = req.session.user;
	// 	Post.update(currentUser.name, req.params.title, req.body.post, function(err) {
	// 		var url = encodeURI('/u/' + req.params.name + '/' + req.params.title);
	// 		if(err) {
	// 			req.flash('error', err);
	// 			return res.redirect(url);
	// 		}
	// 		req.flash('success', '修改成功！');
	// 		res.redirect(url);
	// 	});
	// });

	// app.get('/remove/:name/:title', checkLogin);
	// app.get('/remove/:name/:title', function(req, res) {
	// 	var currentUser = req.session.user;
	// 	Post.remove(currentUser.name, req.params.title, function(err) {
	// 		if(err) {
	// 			req.flash('error', err);
	// 			return res.redirect('back');
	// 		}
	// 		req.flash('success', '删除成功！');
	// 		res.redirect('/');
	// 	})
	// })

};
