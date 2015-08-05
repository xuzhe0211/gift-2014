//分页模块
define(function (require, exports, module) {
	var Pagination = function (opts) {
		this.init(opts);
	};

	Pagination.prototype = {
		init: function (opts) {
			var defaults = {
				//分页容器
				container: '',
				//记录总条数
				total: 10,
				//单页显示记录数
				pageSize: 3,
				//当前页
				currentPage: 1,
				//显示的页码数，当大于则显示省略号
				showCount: 5,
				//当前页选中样式
				selectedClass: 'curr',
				//不可点击样式
				disabledClass: '',
				//第一页样式
				prevClass: 'prev',
				//最后一页样式
				nextClass: 'next',
				//上一页文字
				prevTxt: '上一页',
				//下一页文字
				nextTxt: '下一页',
				//页码的链接
				pageLink: 'javascript:;',
				//显示页面省略
				ellipsis: '...',
				//是否显示跳转
				isGoPage: false,
				//是否隐藏只有一页的分页
				isHideOnepage: false,
				//点击页码回调
				clickCompleate: function () {},
				//分页创建回调
				compleate: function () {},
				//点击第一页回调
				firstPageClickCompleate: function () {},
				//点击最后一页回调
				lastPageClickCompleate: function () {},
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);
			
			if (this.total == 0) return;
			
			this.create();
			this.setPageBtn();
			this.compleate(this.pageCount);
		},
		bindEvent: function () {
			var self = this;
			
			this.container.find('a').unbind('click').bind('click', function () {
			
				self.currentPage = +$(this).text();
				self.create();
				self.setPageBtn();
				
				//当前页、总页数、总条数
				self.clickCompleate.call(this, self.currentPage, self.pageCount, self.total);
				
				if (self.currentPage == 1) {
					self.firstPageClickCompleate(self, self.currentPage, self.pageCount, self.total);
				}
				
				if (self.currentPage == self.pageCount) {
					self.lastPageClickCompleate(self, self.currentPage, self.pageCount, self.total);
				}
			});
			
			this.container.find('.' + this.prevClass).unbind('click').bind('click', function () {
				var ele = self.container.find('a.' + self.selectedClass); 
				ele.prev().click();
			});
			
			this.container.find('.' + this.nextClass).unbind('click').bind('click', function () {
				var ele = self.container.find('a.' + self.selectedClass);
				ele.next().click();
			});
		},
		create: function () {
			var pageArr = [];
			
			this.pageCount = Math.ceil(this.total / this.pageSize);
			this.container = $(this.container);
			
			pageArr.push('<span class=' + this.prevClass + '>' + this.prevTxt + '</span>');
			pageArr.push(this.createPageBodyContent());
			pageArr.push('<span class=' + this.nextClass + '>' + this.nextTxt + '</span>');
			
			//只有一页的数据，是否显示分页
			if (this.pageCount == 1 && this.isHideOnepage) return;
			
			this.container.empty().append(pageArr.join(''));
			this.bindEvent();
			
			this.prevEle = this.container.find('.' + this.prevClass);
			this.nextEle = this.container.find('.' + this.nextClass);
		},
		//创建页码body可变部分（省略号之间的部分）
		createPageBodyContent: function () {
			var pageArr = [], middle = Math.floor(this.showCount / 2), times = 0, startValue = Math.max(this.currentPage - middle, 1);
			
			//是否从显示第一页及省略号
			if (startValue > 2) {
				
				startValue = Math.max(Math.min(startValue, this.pageCount - this.showCount), 1);
				
				if (startValue > 1) pageArr.push('<a href=' + this.pageLink + '>1</a>');
				if (startValue > 2) pageArr.push('<em>' + this.ellipsis + '</em>');
				
			} else {
				if (this.currentPage == 1) {
					pageArr.push('<a href=' + this.pageLink + ' class=' + this.selectedClass + '>1</a>');
				} else {
					pageArr.push('<a href=' + this.pageLink + '>1</a>');
				}
				
				startValue = 2;
			}
			
			for (var i = startValue; i < this.pageCount; i++) {
			
				if (times++ == this.showCount) break;
				
				if (i == this.currentPage) {
					pageArr.push('<a href=' + this.pageLink + ' class=' + this.selectedClass + '>' + i + '</a>');
					continue;
				} else {
					pageArr.push('<a href=' + this.pageLink + '>' + i + '</a>');
				}
				
			}
			
			//是否显示省略号
			if (this.pageCount > i) {
				pageArr.push('<em>' + this.ellipsis + '</em>');
			}
			
			//处理只有一页的情况
			if (this.pageCount < startValue) return pageArr.join('');
			
			if (this.currentPage == this.pageCount) {
				pageArr.push('<a href=' + this.pageLink + ' class=' + this.selectedClass + '>' + i + '</a>');
			} else {
				pageArr.push('<a href=' + this.pageLink + '>' + this.pageCount + '</a>');
			}
			
			return pageArr.join('');
		},
		//设置分页按钮状态
		setPageBtn: function () {
			if (this.currentPage == 1) {
				this.prevEle.hide();
			} else {
				this.prevEle.show();
			}
			
			if (this.currentPage == this.pageCount) {
				this.nextEle.hide();
			} else {
				this.nextEle.show();
			}
		},
		//设置当前页
		setCurrentPage: function (page) {
			this.container.find('a:eq(' + (page - 1) +')').click(); 
		},
		construct: Pagination
	};

	module.exports = Pagination;
});