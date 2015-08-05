//验证模块
define(function(require, exports, module) {
	var validate = {
		//是否验证成功
		isSuccess: function () {
			this.validateAll();
			return $('#set-remind-info .msg.error').size() == 0;
		},
		//送礼对象
		v_jTarget: function () {
			this.bindEvent('#jTarget', this.isNotEmpty);
		},
		//送礼场景
		v_jScene: function () {
			this.bindEvent('#jScene', this.isNotEmpty);
		},
		//送礼时间
		v_remindTime: function () {
			this.bindEvent('#remindTime', this.isNotEmpty);
		},
		//联系方式
		v_telephone: function () {
			this.bindEvent('#telephone', this.isDigital);
		},
		//提前天数
		v_jBeforeDays: function () {
			this.bindEvent('#jBeforeDays', this.isLegal);
		},
		//是否为空
		isNotEmpty: function (value) {
			return $.trim(value).length > 0;
		},
		//是否为手机号
		isDigital: function (value) {
			var reg = /^1\d{10}$/;
			return reg.test(value);
		},
		//提前天数是否合法
		isLegal: function (value) {
			return /^\d+$/.test(value) && +value <= 15 && +value > 0;
		},
		validateAll: function () {
			$('#jTarget, #jScene, #remindTime, #telephone, #jBeforeDays').focusout();
		},
		bindEvent: function (ele, validateFun) {
			var self = this;
			
			$(ele).bind('focusin', function () {
				$(this).next('.msg').remove();
			}).bind('keyup focusout', function () {
				var value = $(ele).val(),
					result = validateFun(value);
				$(this).next('.msg').remove();
				if (result) {
					self.showSuccess(ele);
				} else {
					self.showError(ele);
				}
			})

		},
		init: function () {
			this.v_jTarget();
			this.v_jScene();
			this.v_remindTime();
			this.v_telephone();
			this.v_jBeforeDays();
		},
		showSuccess: function (ele) {
			var ok = '<i class="msg ok"></i>';
			$(ele).after(ok).parent().removeClass('highlight');
		},
		showError: function (ele) {
			var error = '<i class="msg error"></i>';
			$(ele).after(error).parent().addClass('highlight');
			//this.isSuccess = false;
		}
	};
	
	return validate;
});