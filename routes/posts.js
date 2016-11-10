'use strict'

const express = require('express');
const router = express.Router();
const checkLogin = require('../middleware/check').checkLogin;
const Post = require('../models/posts');

// 获取所有用户或者特定用户文章页面
router.get('/', function(req, res, next) {
	let author = req.session.user;

	let cb = function(err, posts, total) {
			res.render('./posts', {
				title: '发表',
				posts: posts,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			})
		};

	if(author) {
		Post.getAllByName(author.name, 1, cb)
	}else {
		Post.getAll(1, cb)
	}
});

// 发表文章页面
router.get('/create', checkLogin, function(req, res, next) {
	res.render('create', {
		title: '发表',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
})

// 发表文章
router.post('/', checkLogin, function(req, res, next) {
	let current = req.session.user;
	let title = req.body.title;
	let content = req.body.content;
	let abstract = req.body.abstract;

	try {
		if(!title.length) {
			throw new Error('请填写标题！');
		}
		if(!content.length) {
			throw new Error('请填写内容！');
		}
	}catch(e) {
		req.flash('error', e.message);
		return res.redirect('back');
	}

	let post = new Post(current.name, title, abstract, content);
	post.save(function(err) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/create');
		}
		req.flash('success', '发布成功！');
		res.redirect('/posts');
	})
});

router.get('/:title', function(req, res, next) {
	let title = req.params.title;

	Post.getOne(title, function(err, post) {
		if(err) {
			req.flash('error', err);
			res.redirect('/posts');
		}
		res.render('article',{ 
			title: title,
			post: post,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		})
	})
})

module.exports = router;