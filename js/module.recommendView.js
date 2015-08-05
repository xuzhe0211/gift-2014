//首页默认推荐商品视图模块
define(function (require, exports, module) {
	var trimPath = require('jdf/1.0.0/unit/trimPath/1.0.0/trimPath.js');
	var LabelView = require('/js/module.labelView.js');
	var CategoryView = require('/js/module.categoryView.js');
	var WaterFall = require('/js/module.waterfall.js');
	var Recommend = function (opts) {
		this.init();
		this.timestamp = new Date().getTime();
		this.lazyload = opts.lazyload;
	};
	
	Recommend.prototype = {
		init: function () {
			this.bindEvent();
		},
		getContent: function () {
			return $('.tab, .classify', '.chooseGift>.mc');
		},
		show: function () {
			$('.chooseGift .mc .crumbs, .chooseGift .mb, .chooseGift .mc .sort').empty();
			$('.chooseGift .mc .tab li').removeClass('cur');
			$('.chooseGift .load').remove();
			this.getContent().show();
			this.removeNoResult();
			$(window).unbind('waterfall.event');
		},
		hide: function () {
			this.getContent().hide();
			$('.chooseGift .mb').empty();
		},
		addLoading: function () {
			$('.chooseGift .mc .loading').remove();
			$('.chooseGift .mc').append('<div class="loading" id=loading_' + this.timestamp + '>正在查询</div>');
		},
		removeLoading: function () {
			$('#loading_' + this.timestamp).remove();
		},
		bindEvent: function () {
			var self = this;
			var labelView = new LabelView();
			var categoryView = new CategoryView();
			
			$('.chooseGift .mc .tab').delegate('li', 'click', function () {
				$(this).addClass('cur').siblings().removeClass('cur');
				self.tab = $('.chooseGift .mc .tab').html();
				self.label = $(this).text();
				self.id = encodeURIComponent($(this).attr('id'));
				$(window).unbind('waterfall.event');
				labelView.create(self, categoryView);
			});
			
			//$('.chooseGift .mc .tab li').addClass('shake-slow');
			
			$('.chooseGift .mc .plist').delegate('.item', 'click', function () {
				delete self.label;
				delete self.catid;
				
				self.type = $(this).find('a>div.txt').text();
				self.catid = $(this).attr('id');
				
				//处理异常
				if (typeof self.catid == "undefined") {
					self.addNoResult();
				} else {
					self.removeNoResult();
					$(window).unbind('waterfall.event');
					categoryView.create(self, {});
				}
			})
		},
		returnTop: function () {
			//返回初始位置
			$('html, body').scrollTop($('.chooseGift').offset().top);
		},
		addNoResult: function () {
			var tpl = '<div class="notice-search">\
							<span class="ns-icon"></span>\
							<div class="ns-content">\
								<span>抱歉，没有找到相关的商品</span>\
							</div>\
						</div>';
			$('.chooseGift').append(tpl);
		},
		removeNoResult: function () {
			$('.chooseGift .notice-search').remove();
		},
		//查询库存状态 skuid string，areaid string
		queryStock: function (skuid, areaid, callback) {
			$.getJSON('/stock/mget', {skuIds: skuid, area: areaid}, function (result) {	
				callback(result);
			});
		}
	};
		
	return Recommend;
});