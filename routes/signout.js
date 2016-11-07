var express = require('express');
var router = express.Router();
var checkLogin = require('../middleware/check').checkLogin;
var User = require('../models/users');

router.get('/',checkLogin, function(req, res, next) {
	req.session.user = null;
	req.flash('success', '登出成功！');
	res.redirect('/');
})

module.exports = router;