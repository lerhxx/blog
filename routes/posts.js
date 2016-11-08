var express = require('express');
var router = express.Router();
var checkLogin = require('../middleware/check').checkLogin;
var Post = require('../models/posts');

// 获取所有用户或者特定用户文章页面
router.get('/', function(req, res, next) {
	var author = req.session.user;

	var cb = function(err, posts, total) {
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
	var current = req.session.user;
	var title = req.body.title;
	var content = req.body.content;
	var abstract = req.body.abstract;

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

	var post = new Post(current.name, title, abstract, content);
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
	var title = req.params.title;

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