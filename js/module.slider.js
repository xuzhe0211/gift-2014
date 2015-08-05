//焦点图模块
define(function (require, exports, module) {
	var Slider = function (opts) {
		opts = $.extend({
			//外部容器
			container: '',
			//导航元素
			navItem: '',
			//面板元素
			panel: '',
			//左、上元素
			prev: '.prev',
			//右、下元素
			next: '.next',
			//方向
			direction: 'x',
			//触发事件
			event: 'mouseover',
			//延迟时间
			delay: 300,
			//选中class
			selectClass: 'curr',
			//回调
			changeComplete: $.noop,
			//是否循环滚动
			isLoop: true,
			timer: null,
			//自动模式
			auto: false,
			//自动间隔时间
			autoTime: 2500,
			//运动状态
			isAnimated: false,
			//当前选中元素
			curIndex: 0,
			//动画持续时间
			duration: 500,
			//上一张、下一张 默认事件
			changeEvent: 'click'
		}, opts);
		
		$.extend(this, opts);
		
		this.init();
	};
	
	Slider.prototype = {
		init: function () {			
			this.lastItem = $('li:last', this.panel);
			this.firstItem = $('li:first', this.panel);
			this.itemWidth = $(this.panel).width();
			this.itemHight = $(this.panel).height();
			this.itemNum = $(this.container).find(this.navItem).size() || $(this.panel).find('li').size();
			this.bindEvent();
			
			if (this.direction == 'x') {
				$(this.panel).width(this.itemWidth * this.itemNum).find('li').css('float', 'left');
			}
			
			if (this.auto) {
				this.createInterval();
			}
			
			$(this.navItem).trigger('change', this.curIndex);
			$(this.panel).trigger('change', this.curIndex);
		},
		bindEvent: function () {
			var self = this;
			
			//绑定导航事件
			$(this.container).delegate(this.navItem, this.event, function () {
				var index = $(this).index();
				clearTimeout(self.timer);
				self.timer = setTimeout(function () {
					$(self.navItem).trigger('change', index);
					$(self.panel).trigger('change', index);
					self.curIndex = index;
				}, self.delay);
				
				clearTimeout(self.interval);
			});
		
			//处理导航元素
			$(this.navItem).bind('change', function (e, index) {
				$(self.navItem).filter(':eq(' + index + ')').addClass(self.selectClass).siblings().removeClass(self.selectClass);
			});
			
			//处理对应面板元素
			$(this.panel).bind('change', function (e, index) {
				if (self.direction == 'x') {				
					$(self.panel).animate({
						left: -1 * index * self.itemWidth
					}, self.duration, function () {
						self.changeComplete(this, index);
					});
				} else {
					$(self.panel).animate({
						top: -1 * index * self.itemHight
					}, self.duration, function () {
						self.changeComplete(this, index);
					});
				}
			});
			
			//鼠标悬浮取消自动播放
			$(this.container).bind('mouseover', function () {
				clearTimeout(self.interval);
				$(self.container).find(self.prev).show();
				$(self.container).find(self.next).show();
			}).bind('mouseout', function () {
				if (self.auto) {
					self.createInterval();
				}
				
				$(self.container).find(self.prev).hide();
				$(self.container).find(self.next).hide();
			});
			
			//绑定上一张事件
			$(this.container).delegate(this.prev, this.changeEvent, function () {
				self.prevAction();
			});
			
			//绑定下一张事件
			$(this.container).delegate(this.next, this.changeEvent, function () {
				self.nextAction();
			});
		},
		prevAction: function () {
			var calLeft = -1 * (this.curIndex - 1) * this.itemWidth, self = this;
			
			if (this.isAnimated) {return;}
			
			if (this.curIndex == 0) {
				this.lastItem.css({position: 'relative', left: -this.itemWidth * this.itemNum});
				this.curIndex = this.itemNum;
			}
			
			this.isAnimated = true;
			
			$(this.panel).animate({left: calLeft}, this.duration, function () {
				if (self.curIndex == self.itemNum) {
					$(self.panel).css('left', -self.itemWidth * (self.itemNum - 1));
					self.lastItem.css({position: '', left: ''});
				}
				self.curIndex--;
				self.isAnimated = false;
				self.changeComplete(this, self.curIndex);
				$(self.navItem).trigger('change', self.curIndex);
			});	
		},
		nextAction: function () {
			var calLeft = -1 * (this.curIndex + 1) * this.itemWidth, self = this;
			
			if (this.isAnimated) {return;}

			if (this.curIndex == this.itemNum - 1) {
				this.firstItem.css({position: 'relative', left: this.itemWidth * this.itemNum});
				this.curIndex = -1;
			}
			
			this.isAnimated = true;
	
			$(this.panel).animate({left: calLeft}, this.duration, function () {
				if (self.curIndex == -1) {
					$(self.panel).css('left', 0);
					self.firstItem.css({position: '', left: ''});
				}
				self.curIndex++;
				self.isAnimated = false;
				self.changeComplete(this, self.curIndex);
				$(self.navItem).trigger('change', self.curIndex);
			});
		},
		createInterval: function () {
			var self = this;
			
			clearTimeout(this.interval);
			this.interval = setInterval(function () {
				self.nextAction();
			}, self.autoTime);
		},
		constructor: Slider
	};
		
	module.exports = Slider;
});