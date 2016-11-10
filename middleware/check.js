'use strict'

module.exports = {
	checkLogin: function checkLogin(req, res, next) {
		if(!req.session.user) {
			req.flash('error', '未登录！');
			res.redirect('/signin');
		}
		next();
	},

	checkNotLogin: function checkNotLogin(req, res, next) {
		if(req.session.user) {
			req.flash('error', '已登录！');
			res.redirect('back');
		}
		next();
	}
}