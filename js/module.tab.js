//tab切换模块
define(function (require, exports, module) {
	var Tab = function (opts) {
		opts = $.extend({
			//外部容器
			container: '',
			//导航元素
			navItem: '',
			//面板元素
			panel: '',
			//触发事件
			event: 'mouseover',
			//延迟时间
			delay: 300,
			//选中class
			selectClass: 'curr',
			//回调
			complete: $.noop,
			timer: null,
			//是否取父级元素
			hasParent: false
		}, opts);
		
		$(opts.container).each(function () {
			var cxt = this;
			
			$(cxt).delegate(opts.navItem, opts.event, function (e) {
				var index = opts.hasParent ? $(this).parent().index() : $(this).index();
				clearTimeout(opts.timer);
				opts.timer = setTimeout(function () {
					$(opts.navItem, cxt).filter(':eq(' + index + ')').trigger('change', [index, cxt]);
					$(window).resize();
				}, opts.delay);
				
				clearTimeout(opts.interval);
			});
		});
		
		$(opts.navItem).bind('change', function (e, index, cxt) {
			var ele = opts.hasParent ? $(opts.navItem).parent() : $(opts.navItem, cxt);
			ele.filter(':eq(' + index + ')').addClass(opts.selectClass).siblings().removeClass(opts.selectClass);
		});
		
		$(opts.navItem).bind('change', function (e, index, cxt) {
			var ele = $(opts.panel, cxt).filter(':eq(' + index + ')');
			opts.complete(ele, index);
		});

	};
		
	module.exports = Tab;
});