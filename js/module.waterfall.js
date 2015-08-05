//瀑布流模块
define(function(require, exports, module) {
	var trimPath = require('jdf/1.0.0/unit/trimPath/1.0.0/trimPath.js');
	var WaterFall = function (opts) {
		opts = $.extend({
			//加载的容器
			container: '',
			//接口地址
			url: '',
			//接口参数
			data: {},
			//测试数据，主用于还没接口测试
			testData: [],
			//返回结果的字段
			resultItem: '',
			//触发的阈值
			threshold: 0,
			//列表生成模板
			tpl: '',
			//显示效果
			effect: 'fadeIn',
			//延迟加载
			scrollTime: null,
			//延迟加载间隔时间
			delay: 100,
			//加载过程中回调
			loading: function () {},
			//加载完成后回调
			complete: function () {}
		}, opts);
		$.extend(this, opts);
		
		this.init();
	};
	
	WaterFall.prototype = {
		init: function () {
			this.bindEvent();
			this.isFinished = true;
		},
		show: function () {
			var self = this;
			var show = function (result) {
				var fragment = self.tpl.process({data: result[self.resultItem]});
				$(self.container).append($(fragment)[self.effect]());
				self.complete(result);
				self.isFinished = true;
			}
			
			if (this.testData && this.testData.length) {
				show(this.testData);
				return;
			}

			$.ajax({
				url: self.url,
				data: self.data,
				dataType: 'json',
				success: function (result) {					
					show(result);
				},
				//XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console && console.info(XMLHttpRequest, textStatus, errorThrown);
				}
			});
			
		}, 
		load: function () {
			this.show();
			this.isFinished = false;
		},
		bindEvent: function () {
			var self = this;
			
			$(window).unbind('waterfall.event').bind('waterfall.event', function () {
				if (self.isBelow()) {
					clearTimeout(self.scrollTime);
					self.scrollTime = setTimeout(function () {
						if (!self.isFinished) return;
						self.loading.call(self);
						self.load.call(self);
					}, self.delay);
				}
			});
			
			$(window).bind('scroll resize', function () {
				$(window).trigger('waterfall.event');
			});
		},
		isBelow: function () {
			var winHeight = $(window).height();
			var scrollTop = $(document).scrollTop();
			var viewHight = $(this.container).offset().top + $(this.container).outerHeight(true);
			
			return winHeight + scrollTop + this.threshold >= viewHight;
		}
	};
	
	return WaterFall;
});