//提醒对象
define(function (require, exports, module) {
	var trimPath = require('jdf/1.0.0/unit/trimPath/1.0.0/trimPath.js');
	var countdown = require('/js/module.countdown.js');
	var dialog = require('jdf/1.0.0/ui/dialog/1.0.0/dialog');
	var validate = require('/js/module.validate.js');
	var Remind = function (opts) {
		opts = $.extend({
			//自定义提醒id
			id: '',
			//固定节日提醒id
			festivalId: '',
			//送礼对象
			target: '',
			//送礼场景
			scenes: '',
			//阳历1,阴历2
			type: 1,
			//remind天
			day: '',
			//remind月
			month: '',
			//送礼时间
			time: '',
			//联系电话
			mobile: '',
			//提前天数
			beforedays: '',
			//是否固定节日
			isTraditional: false,
			//提醒类型 年or天
			noticeType: 'year',
			//成功后的回调
			complete: function () {},
			//提醒模板
			tpl: '<ul>\
					<li>\
						<div class="dt">送礼对象：</div>\
						<div class="dd"><input type="text" class="txt-input" maxlength="10" value="${data.target}" id="jTarget"></div>\
					</li>\
					<li>\
						<div class="dt">送礼场景：</div>\
						<div class="dd"><input type="text" class="txt-input" maxlength="10" value="${data.scenes}" id="jScene"></div>\
					</li>\
					<li>\
						<div class="dt">定制提醒：</div>\
						<div class="dd">\
							<div id="dateRadio">\
								<label><input type="radio" name="dateRadio" value="1" checked="checked">阳历</label>\
								<label><input type="radio" name="dateRadio" value="2">阴历</label>\
							</div>\
						</div>\
					</li>\
					<li>\
						<div class="dt">送礼时间：</div>\
						<div class="dd">\
							<input id="remindTime" type="text" class="txt-input" value="${data.time ? data.time : data.month + "/" + data.day}" readonly>\
						</div>\
					</li>\
					<li>\
						<div class="dt">手&nbsp;机&nbsp;号：</div>\
						<div class="dd"><input type="text" class="txt-input" id="telephone" maxlength="11" value="${data.mobile}"></div>\
					</li>\
					<li class="fore">提前<input type="text" class="txt-input2" value="${data.beforedays}" id="jBeforeDays">天通知我<span class="txt-red">（不能超过15天）</span></li>\
					<li class="fore btns"><a href="javascript:;" class="btn-red determine" id="jdetermine">确定</a><a href="javascript:;" class="btn-gray cancel" id="jcancel">取消</a></li>\
				</ul>'
		}, opts);
		
		$.extend(this, opts);
		this.init.apply(this, arguments);
	};
	
	Remind.prototype = {
		init: function () {
			
		},
		//设置提醒
		set: function (data) {
			this.create(data);
		},
		//自定义提醒
		create: function (data) {		
			$.extend(this, data);
			$('#set-remind-info').empty().append(this.tpl.process({data: this}));
			this.forward();
			this.bindEvent();
			this.isTraditional && this.setDisable();
			this.type == 2 && $('input[name="dateRadio"]:last').attr('checked', true);
			validate.init();
		},
		//删除提醒
		del: function (data) {
			var self = this;
			$.extend(this, data);
			
			var warn = this.createDialog({
				source: '<div class="fxst"><div class="fxst-t"><s class="icon-warn03"></s><strong class="ftx-04">您确定要删除该提醒吗？</strong></div></div>',
				onSubmit: function () {
					self.sendReq({
						url: '/remind/remind/delete',
						data: {id: self.id},
						success: function (result) {
							if (result.code == 1) {
								self.complete();
								$('.ui-dialog-close').click();
							}
						}
					});
				},
				onCancel: function () {
					$('.ui-dialog-close').click();
				},
				closeButton: true,
				hasButton: true,
				height: 50
			});
			

		},
		//编辑提醒
		edit: function (data) {
			this.create(data);
			this.forward();
		},
		bindEvent: function () {
			var self = this;

			//取消
			$('#jcancel').unbind('click').bind('click', function () {
				self.goBack();
			});
			//确定
			$('#jdetermine').unbind('click').bind('click', function () {
				if (validate.isSuccess()) {
					self.saveOrAddAction();
				}
			});
		},
		createDialog: function (opt) {
			opt = $.extend({
				title: '提示',
				closeButton: false,
				width: 240,
				height: 120,
				type: 'html',
				source: ''
			}, opt);
			$('body').dialog(opt);
		},
		getParam: function () {
		
			this.target = $('#jTarget').val();
			this.scenes = $('#jScene').val();
			this.type = $('input[name="dateRadio"]:checked').val();
			this.time = $('#remindTime').val();
			this.month = this.time.split('\/')[0];
			this.day = this.time.split('\/')[1];
			this.mobile = $('#telephone').val();
			this.beforedays = $('#jBeforeDays').val();
			
			return {
				id: this.id || '', festivalId: this.festivalId || '', target: this.target, 
				scenes: this.scenes, type: this.type, day: this.day, month: this.month,
				time: this.time, mobile: this.mobile, beforedays: this.beforedays,
				isTraditional: this.isTraditional, noticeType: this.noticeType
			};
		},
		sendReq: function (opt) {
			$.ajax({
				url: opt.url,
				dataType: 'jsonp',
				data: opt.data || {},
				success: function (result) {
					opt.success(result);
				},
				error: function (a, b, c) {
					console.info(a, b, c)
				}
			});
		},
		//新增或者编辑 保存操作
		saveOrAddAction: function () {
			var self = this;
			
			this.sendReq({
				url: '/remind/remind/add',
				data: self.getParam(),
				success: function (result) {
					if (result.code == 1) {
						self.openCountdown();
					}
					
					if (result.code == 0 && result.errorMessage.length) {
						var warn = self.createDialog({
							source: '<div class="fxst"><div class="fxst-t"><s class="icon-warn03"></s><strong class="ftx-04">' + result.errorMessage + '</strong></div></div>',
							closeButton: true,
							hasButton: false,
							height: 50
						});
					}
				}
			});
		},
		setDisable: function () {
			$('#remindTime, #jScene, input[name="dateRadio"]').css('cursor', 'not-allowed').attr('disabled', true);
		},
		forward: function () {
			$('#reminder-list, .gifts-video').hide();
			$('#set-remind-info').show();
		},
		goBack: function () {
			$('#reminder-list, .gifts-video').show();
			$('#set-remind-info').hide();
			this.closeCountdown();
		},
		openCountdown: function () {
			var now = new Date().getTime(), end = now + 1000 * 4, self = this;
			$('#remind-box-info, .remind-box').show();
			countdown(now, end, function (d, h, m, s) {
				$('#time').text(s);
			}, function () {
				self.complete();
				self.goBack();
			}, false, 1000);
		},
		closeCountdown: function () {
			$('#remind-box-info, .remind-box').hide();
		},
		validate: function () {
			
		}
	};
	
	module.exports = Remind;
});