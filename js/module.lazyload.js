//懒加载模块
define(function (require, exports, module) {
	var Lazyload = function (opts) {
		this.init(opts);
	};

	Lazyload.prototype = {
		init: function (opts) {
			var defaults = {
				//目标元素
				selector: '',
				//触发的阈值
				threshold: 0,
				//触发事件
				event: 'scroll',
				//显示效果 
				effect: 'show',
				//默认容器
				container: window,
				//图片路径的保留属性
				data_attribute: 'data-original',
				//加载完成后的回调
				load: $.noop,
				//图片加载失败后的回调
				error: $.noop,
				//填充值
				placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.setDefaultSrc();
			this.bindEvent(settings);
		},
		setDefaultSrc: function () {
			var _this = this;
			
			$(this.selector).each(function () {
				var self = this;
				self.isLoaded = false;
				$(self).attr('src', _this.placeholder);
			});
		},
		bindEvent: function () {
			var self = this;
			var show = function () {
				$(self.selector).each(function () {
					if (!self.belowthefold(this) && !self.rightoffold(this) && !this.isLoaded) {
						self.appear(this);
					}
				});
			};
			
			$(this.container).bind(this.event, show);
			$(window).bind('resize', show);
			$(show);
		},
		update: function () {
			setTimeout(function () {
				$(window).resize();
			}, 1000);
		},
		appear: function (ele) {
			var original = $(ele).attr(this.data_attribute);
			
			$(ele).hide();
			
			if ($(ele).is('img')) {
				$(ele).attr('src', original).removeAttr(this.data_attribute);
			} else {
				$(ele).css('background-image', 'url(' + original + ')');
			}
			
			$(ele)[this.effect]();
			ele.isLoaded = true;
			
			$(ele).bind('load', this.load);
			$(ele).bind('error', this.error);
		},
		belowthefold: function (element) {
			var fold;
			
			if (this.container === undefined || this.container === window) {
				fold = $(window).height() + $(window).scrollTop();
			} else {
				fold = $(this.container).offset().top + $(this.container).height();
			}
			
			return fold <= $(element).offset().top - this.threshold;
		},
		rightoffold: function (element) {
			var fold;
			
			if (this.container === undefined || this.container === window) {
				fold = $(window).width() + $(window).scrollLeft();
			} else {
				fold = $(this.container).offset().left + $(this.container).width();
			}
			
			return fold <= $(element).offset().left - this.threshold;
		},
		construct: Lazyload
	};

	module.exports = Lazyload;
});