//滚动条模块
define(function (require, exports, module) {
	var Scrollbar = function (opts) {
		this.init(opts);
	};

	Scrollbar.prototype = {
		init: function (opts) {
			var defaults = {
				//是否是纵向
				isVertical: true,
				//滚动条是否有头尾按钮
				isHaveHead: false,
				//滚动单次移动距离
				step: 15,
				//滚动条滑块样式
				scrollbarBodyClass: 'ui-scroll-body',
				//滚动条头部样式
				scrollHeadClass: 'ui-scroll-head',
				//滚动条尾部样式
				scrollNailClass: 'ui-scroll-nail',
				//滚动条样式
				scrollbarClass: 'ui-scroll',
				//包含滚动条以及滚动条控制区域的直接父级元素
				controledParentEle: '',
				//滚动条控制区域元素
				controledEle: '',
				//头尾图片的宽、高，用作偏移量
				scrollbarOffset: 15,
				//滚动条默认层级
				scrollzIndex: 1,
				//滚动条默认坐标值
				coord: {top: 0, right: 0, bottom: 0, left: 0}
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.create();
		},
		//判断是否添加滚动条
		isAddScroll: function () {
			if ($(this.controledEle).outerHeight(true) < $(this.controledParentEle).height() && this.isVertical) {
				return false;
			}
			
			if ($(this.controledEle).width() < $(this.controledParentEle).width() && !this.isVertical) {
				return false;
			}
			
			return true;
		},
		create: function () {
		
			var hScrollStyle = {position: 'absolute', left: this.coord.left, bottom: this.coord.bottom, scrollzIndex: this.scrollzIndex};
			var vScrollStyle = {position: 'absolute', right: this.coord.right, top: this.coord.top, scrollzIndex: this.scrollzIndex};
			
			//过滤
			if (!this.isAddScroll()) return true;
		
			this.container = $(this.controledParentEle).css({position: 'relative', overflow: 'hidden'});
			this.controledEle = $(this.controledEle).css({position: 'relative'});
			this.containerHeight = this.container.outerHeight(true);
			this.controledHeight = this.controledEle.outerHeight(true) + parseInt(this.container.css('paddingTop'), 10) + parseInt(this.container.css('paddingBottom'), 10);
			this.containerWidth = this.container.outerWidth(true);
			//这里需要使用scrollWidth，其他方式width() outerWidth()，均偏小
			this.controledWidth = this.controledEle.width();
			
			//创建滚动条对象
			this.scrollbar = $('<div class=' + this.scrollbarClass + '>');
			this.scrollbarBody = $('<div class=' + this.scrollbarBodyClass + '>').css({position: 'absolute', scrollzIndex: this.scrollzIndex + 1});
			this.scrollbarHead = $('<div class=' + this.scrollHeadClass + '>').css({position: 'absolute', scrollzIndex: this.scrollzIndex + 1});
			this.scrollbarNail = $('<div class=' + this.scrollNailClass + '>').css({position: 'absolute', scrollzIndex: this.scrollzIndex + 1});
			
			this.scrollbar.append(this.scrollbarHead);
			this.scrollbar.append(this.scrollbarNail);
			this.scrollbar.append(this.scrollbarBody);
			this.container.append(this.scrollbar);

			//绑定事件
			this.scrollbarBody.bind('mousedown', $.proxy(this.mousedown, this));
			this.scrollbarBody.bind('click', this.preventDefaultAndPropagation);
			this.scrollbar.bind('click', $.proxy(this.clickBar, this));
			this.container.get(0).onmousewheel = $.proxy(this.mouseWheel, this);
			//for firfox
			this.container.get(0).addEventListener && this.container.get(0).addEventListener('DOMMouseScroll', $.proxy(this.mouseWheel, this));
			
			
			if (this.isVertical) {
				this.scrollbar.css(vScrollStyle);
				this.scrollbarNail.css('bottom', 0);
			} else {
				this.scrollbar.css(hScrollStyle);
				this.scrollbarNail.css('right', 0);
			}
			
			this.setEleSize();
		},
		setEleSize: function () {
			//判断方向
			if (this.isVertical) {
				this.scrollbar.height(this.containerHeight);
				this.controledEle.css('top', 0);
			
				var scrollbarBodyHeight = this.containerHeight / this.controledHeight * (this.containerHeight - this.scrollbarOffset * 2);
				this.scrollbarBodyHeight = scrollbarBodyHeight;
				this.scrollbarBody.css('marginTop', this.scrollbarOffset);
				this.scrollbarBody.height(scrollbarBodyHeight);
			} else {				
				this.scrollbar.width(this.containerWidth);
				this.controledEle.css('left', 0);
			
				var scrollbarBodyWidth = this.containerWidth / this.controledWidth * (this.containerWidth - this.scrollbarOffset * 2);
				this.scrollbarBodyWidth = scrollbarBodyWidth;
				this.scrollbarBody.css('marginLeft', this.scrollbarOffset);
				this.scrollbarBody.width(scrollbarBodyWidth);
			}
		},
		update: function () {
			this.setEleSize();
		},
		mousedown: function (e) {
			var e = e || window.event;

			this.scrollbarBody.y = e.pageY;
			this.scrollbarBody.oft = parseInt($(this.scrollbarBody).css('marginTop'), 10);

			//判断方向
			if (!this.isVertical) {
				this.scrollbarBody.x = e.pageX;
				this.scrollbarBody.oft = parseInt($(this.scrollbarBody).css('marginLeft'), 10);
			}

			document.onmousemove = $.proxy(this.mousemove, this);
			this.preventDefaultAndPropagation(e);
		},
		mousemove: function (e) {
			var e = e || window.event;

			//判断方向
			this.isVertical ? 
				(this.marginTop = this.scrollbarBody.oft + e.pageY - this.scrollbarBody.y) : 
				(this.marginLeft = this.scrollbarBody.oft + e.pageX - this.scrollbarBody.x);

			this.changeLoc();

			document.onmouseup = function () {document.onmousemove = null;};
			this.preventDefaultAndPropagation(e);
		},
		changeLoc: function () {

			if (this.marginLeft < this.scrollbarOffset) {
				this.marginLeft = this.scrollbarOffset;
			}

			if (this.marginLeft > this.containerWidth - this.scrollbarBodyWidth - this.scrollbarOffset) {
				this.marginLeft = this.containerWidth - this.scrollbarBodyWidth - this.scrollbarOffset;
			}

			if (this.marginTop < this.scrollbarOffset) {
				this.marginTop = this.scrollbarOffset;
			}

			if (this.marginTop > this.containerHeight - this.scrollbarBodyHeight - this.scrollbarOffset) {
				this.marginTop = this.containerHeight - this.scrollbarBodyHeight - this.scrollbarOffset;
			}
			
			if (this.isVertical) {
				var topValue = -1 * (this.controledHeight - this.containerHeight + 10) * (this.marginTop - this.scrollbarOffset) / (this.containerHeight - this.scrollbarBodyHeight - this.scrollbarOffset * 2)
				this.scrollbarBody.css('marginTop', this.marginTop);
				this.controledEle.css('top', topValue);
				return;
			} 

			var leftValue = -1 * (this.controledWidth - this.containerWidth) * (this.marginLeft - this.scrollbarOffset) / (this.containerWidth - this.scrollbarBodyWidth - this.scrollbarOffset * 2)
			this.scrollbarBody.css('marginLeft', this.marginLeft);
			this.controledEle.css('left', leftValue);
		},
		mouseWheel: function (e) {
			var e = e || window.event;
			var delta = e.wheelDelta || e.detail;

			if (delta == 3 || delta == -120) {
				this.marginLeft = parseInt(this.scrollbarBody.css('marginLeft'), 10) + this.step;
				this.marginTop = parseInt(this.scrollbarBody.css('marginTop'), 10) + this.step;
			} else {
				this.marginLeft = parseInt(this.scrollbarBody.css('marginLeft'), 10) - this.step;
				this.marginTop = parseInt(this.scrollbarBody.css('marginTop'), 10) - this.step;
			}

			this.changeLoc();
			this.preventDefaultAndPropagation(e);
		},
		clickBar: function (e) {
			var e = e || window.event;
			var cx = e.pageX;
			var cy = e.pageY;
			var ofx = this.scrollbar.offset().left;
			var ofy = this.scrollbar.offset().top;
			var marginLeft = parseInt(this.scrollbarBody.css('marginLeft'), 10);
			var marginTop = parseInt(this.scrollbarBody.css('marginTop'), 10);

			if (cx - ofx > marginLeft + this.scrollbarBodyWidth) {
				this.marginLeft = marginLeft + this.step;
			} else {
				this.marginLeft = marginLeft - this.step;
			}

			if (cy - ofy > marginTop + this.scrollbarBodyHeight) {
				this.marginTop = marginTop + this.step;
			} else {
				this.marginTop = marginTop - this.step;
			}

			this.changeLoc();
			this.preventDefaultAndPropagation(e);
		},
		preventDefaultAndPropagation: function (e) {
            if (!e) {
                return;
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.cancelBubble = true;

			if (e.preventDefault) {
			    e.preventDefault();
			} else {
			    e.returnValue = false;
			}
		}
	};

	return Scrollbar;
});