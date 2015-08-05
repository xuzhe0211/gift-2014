//三级分类推荐商品视图
define(function (require, exports, module) {
	var trimPath = require('jdf/1.0.0/unit/trimPath/1.0.0/trimPath.js');
	var WaterFall = require('/js/module.waterfall.js');
	var Page = require('/js/module.pagination.js');
	var area = require('jdf/1.0.0/ui/area/1.0.0/area');
	var switchtable = require('jdf/1.0.0/ui/switchable/1.0.0/switchable');
	var CategoryRecommend = function () {
		
		this.tpl = {
			nav: '<div class="crumbs clearfix">\
						{if total}\
						<div class="filter">\
							<dl class="store">\
								<dt>配送至：</dt>\
								<dd id="store-selector" class="ui-area-wrap">\
									<div class="ui-area-text-wrap">\
										<div class="ui-area-text"></div>\
										<b></b>\
									</div>\
									<div class="ui-area-content-wrap">\
										<div class="ui-area-tab"></div>\
										<div class="ui-area-content"></div>\
										<div class="ui-area-close"></div>\
									</div>\
								</dd>\
								<dd class="instock" id="j-instock">\
									<div>\
										<a title="选择省份后可进行有货筛选" rel="nofollow" href="javascript:;"><b></b>仅显示有货</a>\
									</div>\
								</dd>\
							</dl>\
							<dl class="order">\
								<dt>排序：</dt>\
								<dd data-param=\'{"upClass": "up", "downClass": "down", "asc": "sort_redissale_asc", "desc": "sort_redissale_desc"}\'><a href="javascript:;">销量</a><b></b></dd>\
								<dd data-param=\'{"upClass": "up", "downClass": "down", "asc": "sort_xredisprice_asc", "desc": "sort_xredisprice_desc"}\'><a href="javascript:;">价格</a><b></b></dd>\
								<dd data-param=\'{"desc": "sort_commentcount_desc"}\'><a href="javascript:;">评论数</a><b></b></dd>\
								<dd data-param=\'{"desc": "sort_winsdate_desc"}\'><a href="javascript:;">上架时间</a><b></b></dd>\
							</dl>\
							<div id="top_page" class="pagin">\
								<span class="text"><i>0</i>/0</span>\
								<span class="prev prev-disabled">上一页<b></b></span>\
								<span class="next">下一页<b></b></span>\
							</div>\
						</div>\
						{/if}\
						<a href="javascript:;" id="jCBack">选礼物</a>\
						{if label}\
						<a href="javascript:;" id="jCType"><em>&gt;</em>${label}</a>\
						{/if}\
						<em>&gt;</em>${type}\
					</div>',
			list: '<div class="plist clearfix">\
					{for item in data}\
					{if item_index < 5}\
					<div class="item fore am-animation-slide-top">\
					{elseif}\
					<div class="item fore am-animation-slide-bottom">\
					{/if}\
						<div class="p-img">\
							{if item.isSupportGift}\
							<a catid="${item.catid}" target="_blank" href="http://item.jd.com/${item.wareid}.html?gift=true">\
							{elseif}\
							<a catid="${item.catid}" target="_blank" href="http://item.jd.com/${item.wareid}.html">\
							{/if}\
								<img alt="${item.Content.wname}" data-original="${item.Content.imageurl}">\
							</a>\
						</div>\
						<div class="p-price"><strong>￥${item.price}</strong></div>\
						<div class="p-name">\
							{if item.isSupportGift}\
							<a sku="${item.wareid}" catid="${item.catid}" target="_blank" title="${item.Content.wname}" href="http://item.jd.com/${item.wareid}.html?gift=true">${item.Content.wname}</a>\
							{elseif}\
							<a sku="${item.wareid}" catid="${item.catid}" target="_blank" title="${item.Content.wname}" href="http://item.jd.com/${item.wareid}.html">${item.Content.wname}</a>\
							{/if}\
						</div>\
						<div class="btns">\
							{for label in item.Content.impressions}\
							<a title="${label}">${label}</a>\
							{/for}\
						</div>\
						<div class="stockStatus" product-sku="${item.wareid}"></div>\
					</div>\
					{/for}\
                  </div>',
			page: '	<div class="page mt15">\
					</div>',
			loading: '<div class="load">正在加载...</div>'
		};
		
		this.init();
	};
	
	CategoryRecommend.prototype = {
		init: function () {
			this.bindEvent();
			
			if ($('.page .next').is(':visible')) {
				$('#top_page .next').removeClass('next-disabled');
			}
		},
		getParam: function () {
			var baseObj = {
				catalogId: this.labelInstance.catid || this.recommendInstance.catid,
				pageSize: 10,
				pageNo: this.pageNo || 1,
			};
			
			//排序
			if (this.sortParam) {
				baseObj.sort = this.sortParam;
			}
			
			//显示有货
			if (this.isSelected) {
				baseObj.availableOnly = this.isSelected;
			}
			
			//显示有货
			if (this.provinceId && this.isSelected) {
				baseObj.locationId = this.provinceId;
			}
			
			//添加标签值
			if (this.recommendInstance.id) {
				baseObj.key = this.recommendInstance.id;
			}
			
			return baseObj;
		},
		create: function (recommendInstance, labelInstance) {
			var navData = {label: recommendInstance.label, type: recommendInstance.type, total: 0}, self = this;
			
			this.recommendInstance = recommendInstance;
			this.labelInstance = labelInstance;
			
			this.pageNo = 1;
			delete this.sortParam;
			
			recommendInstance.addLoading();
			this.getDataAction(function (result) {
				var total = +result.data.Head.Summary.ResultCount || 0, skuids = [];
				navData.total = total;
				
				recommendInstance.hide();
				recommendInstance.removeLoading();
				$('.chooseGift .mc .crumbs, .chooseGift .mc .sort').hide();
				$('.chooseGift .mb').append(self.tpl.nav.process(navData))
									.append(self.tpl.list.process({data: result.data.Paragraph}))
									.append(self.tpl.page);
				self.createPage(total, 10);
				recommendInstance.lazyload.update();
			}, function () {
				self.recommendInstance.hide();
				self.recommendInstance.removeLoading();
				self.recommendInstance.addNoResult();
				
				$('.chooseGift .mc .crumbs, .chooseGift .mc .sort').hide();
				$('.chooseGift .mb').append(self.tpl.nav.process(navData));
			});
			
		},
		createPage: function (total, pageSize) {
			var self = this;
			var paged = new Page({
				container: '.chooseGift .mb .page',
				total: total,
				pageSize: pageSize,
				clickCompleate: function (currentPage, total) {
					self.recommendInstance.returnTop();
					self.pageNo = currentPage;
					self.updateContent();
					$('#top_page span:first').html('<i>' + currentPage + '</i>/' + total);
					
					if (currentPage != total && total > 1) {
						$('#top_page span.next').removeClass('next-disabled');
					}
					
					if (total > 1 && currentPage > 1) {
						$('#top_page span.prev').removeClass('prev-disabled');
					}
				},
				compleate: function (total) {
					$('#top_page span:first').html('<i>' + 1 + '</i>/' + total);
					
					if ((self.total = total) <= 1) {
						$('#top_page span.next').addClass('next-disabled');
					}
					
					$('#top_page span.prev').addClass('prev-disabled');
					
					self.recommendInstance.returnTop();
				},
				firstPageClickCompleate: function () {
					$('#top_page span.prev').addClass('prev-disabled');
				},
				lastPageClickCompleate : function () {
					$('#top_page span.next').addClass('next-disabled');
				}
			});
		},
		//库存状态
		stockMap: {
			33: ['有货', '现货-下单立即发货'],
			39: ['有货', '在途-正在内部配货，预计2~6天到达本仓库'],
			40: ['有货', '可配货-下单后从有货仓库配货'],
			36: ['预订'],
			34: ['无货']
		},
		setStock: function (areaid, areaname) {
			var skuids = function () {
				var arr = [];
				$('.chooseGift .mb .plist a[sku]').each(function() {arr.push($(this).attr('sku'))});
				return arr.join();
			}();
			var self = this;
			self.recommendInstance.queryStock(skuids, areaid, function (result) {
				var data = result.data || [];
				
				for (var i = 0, l = data.length; i < l; i++) {
					var obj = data[i];
					var sku = obj.skuId;
					var stockStateDesc = obj.stockStateDesc;
					
					$('div[product-sku=' + sku + ']').text(areaname + stockStateDesc);
				}
			});
		},
		updateContent: function (isCreatePage) {
			var self = this;
			this.getDataAction(function (result) {
				$('.chooseGift .mb .plist').replaceWith(self.tpl.list.process({data: result.data.Paragraph}));
				isCreatePage && self.createPage(+result.data.Head.Summary.ResultCount || 0, 10);
				self.recommendInstance.lazyload.update();
			});
		},
		bindEvent: function () {
			var self = this;
			
			$('.chooseGift .mb').delegate('#jCBack', 'click', function () {
				self.recommendInstance.show();
			});
			
			$('.chooseGift .mb').delegate('.crumbs>em', 'click', function () {
				self.recommendInstance.create();
			});
			
			$('.chooseGift .mb').delegate('#jCType', 'click', function () {
				self.labelInstance.create(self.recommendInstance, self);
			});
			
			
			//顶栏分页
			$('.chooseGift .mb').delegate('#top_page span.next', 'click', function () {
				if ($(this).hasClass('next-disabled')) return;
				
				$(this).prev().removeClass('prev-disabled');
				
				if ($('.page .next').is(':hidden')) {
					$(this).addClass('next-disabled');
					return;
				} else {
					$(this).removeClass('next-disabled');
					$('.page .next').click();
				}
			});
			
			$('.chooseGift .mb').delegate('#top_page span.prev', 'click', function () {
				if ($(this).hasClass('prev-disabled')) return;
			
				$(this).next().removeClass('next-disabled');
				
				if ($('.page .prev').is(':hidden')) {
					$(this).addClass('prev-disabled');
					return;
				} else {
					$(this).removeClass('prev-disabled');
					$('.page .prev').click();
				}
			});
			
			$('.chooseGift .mb').delegate('.filter .order>dd[data-param]', 'click', function () {
				var param = $(this).data('param');
				$(this).addClass('curr').siblings().removeClass('curr up down');
				
				//销量、价格指标
				if (param.hasOwnProperty('upClass')) {
					var up = param.upClass;
					var down = param.downClass;
					
					if ($(this).hasClass(up)) {
						$(this).removeClass(up).addClass(down);
						
						self.sortParam = param.desc;
					} else if ($(this).hasClass(down)) {
						$(this).removeClass(down).addClass(up);
						
						self.sortParam = param.asc;
					} else {
						if (!$(this).hasClass(up) && !$(this).hasClass(down)) {
							$(this).addClass(down);
							
							self.sortParam = param.desc;
						}
					}
				} else {
					//评论数、上架时间指标
					self.sortParam = param.desc;
				}
				
				self.pageNo = 1;
				self.updateContent(true);
				
				//重置翻页按钮状态
				if (self.total <= 1) {
					$('#top_page span.next').addClass('next-disabled');
				} else {
					$('#top_page span.next').removeClass('next-disabled');
				}
			});
			
			//仅显示有货
			$('.chooseGift .mb').delegate('#j-instock', 'click', function () {
				var ele = $('#j-instock>div').toggleClass('selected');
				var isSelected = ele.hasClass('selected');
				
				self.pageNo = 1;
				
				if (isSelected) {
					self.isSelected = true;
					self.showStock();
				} else {
					self.isSelected = false;
					self.resetNav(true, true, {nextDisabled: false});
					self.updateContent(true);
				}
			});
		},
		getDataAction: function (callback, noResultCallback) {
			var self = this;
			
			$.getJSON('/search/productSearch', this.getParam(), function (result) {
				var total = result.data.Head.Summary.ResultCount;
				self.total = total;
				
				if (total > 0) {
					self.recommendInstance.removeNoResult();
					callback(result);
					
					//增加配送至区域，显示库存
					$('#store-selector').area({onChange: function (area, local) {
						var areaid = local.provinceId + '_' + local.cityId + '_' + local.districtId;
						self.setStock(areaid, local.provinceName);
						self.provinceId = local.provinceId;
						
						var isSelected = $('#j-instock>div').hasClass('selected');
						isSelected && self.showStock();
					}, onReady: function (local) {
						var areaid = local.provinceId + '_' + local.cityId + '_' + local.districtId;
						self.setStock(areaid, local.provinceName);
						self.provinceId = local.provinceId;
					}});
					
					//无结果
					self._tofix('hidden');
				} else {
					noResultCallback && noResultCallback.call();
				}
			
			});
		},
		//显示有货
		showStock: function () {
			var self = this;
			
			this.getDataAction(function (result) {
				var total = +result.data.Head.Summary.ResultCount || 0;
				self.total = total;
				
				$('.chooseGift .mb .plist').replaceWith(self.tpl.list.process({data: result.data.Paragraph}));
				self.createPage(total, 10);
				self.recommendInstance.lazyload.update();
			}, function () {
				self.total = 0;
				$('.chooseGift .mb .plist').hide();
				$('.chooseGift .mb .page').empty();
				self.recommendInstance.addNoResult();
				self.resetNav(true, true, {nextDisabled: true});
				self._tofix('inherit');
			});
		},
		_tofix: function (style) {
			var ele = $('.notice-search').parents('.w');
		
			if (ele.size()) {
				ele.css('overflow', style);
			} else {
				$('#container .w').css('overflow', style);
			}
		},
		//重置导航条
		resetNav: function (resetSort, resetPage, opts) {
			var sorttpl = '<dl class="order">\
								<dt>排序：</dt>\
								<dd data-param=\'{"upClass": "up", "downClass": "down", "asc": "sort_redissale_asc", "desc": "sort_redissale_desc"}\'><a href="javascript:;">销量</a><b></b></dd>\
								<dd data-param=\'{"upClass": "up", "downClass": "down", "asc": "sort_xredisprice_asc", "desc": "sort_xredisprice_desc"}\'><a href="javascript:;">价格</a><b></b></dd>\
								<dd data-param=\'{"desc": "sort_commentcount_desc"}\'><a href="javascript:;">评论数</a><b></b></dd>\
								<dd data-param=\'{"desc": "sort_winsdate_desc"}\'><a href="javascript:;">上架时间</a><b></b></dd>\
							</dl>';
							
			var pagetpl = '<div id="top_page" class="pagin">\
								<span class="text"><i>0</i>/0</span>\
								<span class="prev prev-disabled">上一页<b></b></span>\
								{if data.nextDisabled}\
								<span class="next next-disabled">下一页<b></b></span>\
								{elseif}\
								<span class="next">下一页<b></b></span>\
								{/if}\
							</div>';
			
			resetSort && $('.chooseGift .filter .order').replaceWith(sorttpl);
			resetPage && $('#top_page').replaceWith(pagetpl.process({data: opts}));
		}
	};
		
	return CategoryRecommend;
});