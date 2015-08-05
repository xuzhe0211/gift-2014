//登录验证模块
define(function(require, exports, module) {
	var login = require('jdf/1.0.0/unit/login/1.0.0/login.js');
	var jdUser = {};

	// 初始化
	jdUser.init = function(){

		this.isLogin = false;
		this.checkLogin();

	};

	// 检查登陆
	jdUser.checkLogin = function(callback){

		var _this = this;

		$.getJSON('http://passport.jd.com/loginservice.aspx?method=Login&callback=?', function(r) {

			if ( r.Identity.IsAuthenticated ) {
				_this.isLogin = true;
			}else{
				_this.isLogin = false;
			}
			
			callback && callback(_this.isLogin);
		});

	}

	// 登陆
	jdUser.login = function(fuc, isRefresh){

		var _this = this;
		var cb = fuc || $.noop;

		// 登陆弹框
		login({
			modal: true,//false跳转,true显示登录注册弹层
			complete: function() {

				_this.isLogin = true;
				
				//isRefresh 判断登录成功后是否刷新页面，默认不刷新
				isRefresh ? location.reload(true) : cb();
			}
		});

	};

	// 用户登陆状态 初始化
	jdUser.init();
	
	return jdUser;
});