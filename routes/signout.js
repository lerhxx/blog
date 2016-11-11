'use strict'

const express = require('express');
const router = express.Router();
const checkLogin = require('../middleware/check').checkLogin;
const User = require('../models/users');

router.get('/',checkLogin, (req, res, next) => {
	req.session.user = null;
	req.flash('success', '登出成功！');
	res.redirect('/');
})

module.exports = router;