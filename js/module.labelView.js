//点击便签进入推荐商品视图模块
define(function (require, exports, module) {
	var trimPath = require('jdf/1.0.0/unit/trimPath/1.0.0/trimPath.js');
	var LazyLoad = require('/js/module.lazyload.js');
	var WaterFall = require('/js/module.waterfall.js');
	var LabelRecommend = function () {
		
		this.tpl = {
			tab: '{for item in data}\
					<li class="fore${(+item_index) + 1}" id=${item.id}>${item.text}</li>\
				  {/for}',
			label: '<a href="javascript:;" id="jBack">选礼物</a>\
					<em>&gt;</em>${label}',
			list: '{for list in data}\
					{if list != null}\
					<div class="slist am-animation-scale-up" data-param=\'{"catid": ${list.cid}, "name": "${list.name}"}\'>\
						{for item in list.products}\
						{if item_index < 3}\
						<div class="item fore${(+item_index) + 1}">\
							<a href="javascript:;">\
								<img data-original="${item.Content.imageurl}" width="169">\
								<s></s>\
							</a>\
						</div>\
						{/if}\
						{/for}\
						<div class="item fore4 mt">\
							<a href="javascript:;">\
								${list.name}\
								<s></s>\
							</a>\
						</div>\
					</div>\
					{/if}\
					{/for}',
			loading: '<div class="load">正在加载...</div>'
		};
		
		this.cache = {};
		this.lazyload = LazyLoad;
		this.init();
		
		//模拟瀑布流，索引值、单次加载数
		this.waterPageIndex = 0;
		this.waterPageSize = 6;
	};
	
	LabelRecommend.prototype = {
		init: function () {
			this.bindEvent();
		},
		insertData: function (index, item, arr) {
			var temp = arr.splice(index);
			arr.push(item);
			return arr.concat(temp);
		},
		create: function (recommendInstance, categoryInstance) {
		
			var labelData = {label: recommendInstance.label};
			var param = {key: recommendInstance.id, pageSize: 1, pageNo: 1}, self = this;
			var containerEle = $('.chooseGift .mc .sort').empty().show();
			this.isSuspend = false;
			
			recommendInstance.hide();
			recommendInstance.addLoading();
			recommendInstance.removeNoResult();
			$('.chooseGift .mc .crumbs').empty().append(this.tpl.label.process(labelData)).show();
			$('.chooseGift .mc .tab').empty().append(recommendInstance.tab).show();
			
			var cacheData = this.cache[recommendInstance.label], count = 0;
			
			var renderDataAction = function (catids) {
			
				var waterFall = new WaterFall({
					container: containerEle,
					tpl: self.tpl.list,
					delay: 50,
					resultItem: 'data',
					url: '/search/getTop3ProductsByCatalogs',
					data: function () {
						var obj = {};
						
						obj.catalogs = catids.slice(self.waterPageIndex, self.waterPageSize).join();
						recommendInstance.id && (obj.key = recommendInstance.id);
						
						return obj;
					}(),
					loading: function () {
						$('.chooseGift .load').remove();
						$('.chooseGift .mb').append(self.tpl.loading);
					},
					complete: function (result) {
						count++;
						$('.chooseGift .load').remove();
						recommendInstance.removeLoading();
						recommendInstance.lazyload.update();
						
						var startIndex = self.waterPageIndex + count * self.waterPageSize;
						var endIndex = (count + 1) * self.waterPageSize;
						
						//重新生成参数
						waterFall.data = {catalogs: catids.slice(startIndex, endIndex).join()};
						
						if (recommendInstance.id) {
							waterFall.data.key = recommendInstance.id;
						}
						
						if (result.data == null || result.data.length == 0) {
							recommendInstance.removeLoading();
							$('.chooseGift .load').remove();
							$(window).unbind('waterfall.event');
						}
						
						if (startIndex >= catids.length) {
							recommendInstance.removeLoading();
							$('.chooseGift .load').remove();
							$(window).unbind('waterfall.event');
						}
					}
				});

				recommendInstance.lazyload.update();
				
			};
			
			if (!cacheData) {
				this.getData('/search/productSearch', param, function (result) {
					
					if (!result.data.ObjCollection || !result.data.ObjCollection.catid.length) {
						recommendInstance.addNoResult();
						recommendInstance.removeLoading();
						return;
					}
				
					self.cache[recommendInstance.label] = $.map(result.data.ObjCollection.catid, function (n) {return n.Classification});
					
					renderDataAction(self.cache[recommendInstance.label]);
				});
			} else {
				renderDataAction(cacheData);
			}
			
			this.recommendInstance = recommendInstance;
			this.categoryInstance = categoryInstance;
			
		},
		getData: function (url, data, success) {
			$.getJSON(url, data, function (result) {
				success(result);
			});
		},
		renderImg: function () {
			var lazy = new this.lazyload({
				selector: 'img[data-original]',
				effect: 'fadeIn'
			});
		},
		bindEvent: function () {
			var self = this;
			
			$('.chooseGift .mc').delegate('#jBack', 'click', function () {
				self.recommendInstance.show();
			});
			
			$('.chooseGift .mc .sort').delegate('.slist', 'click', function () {
				self.recommendInstance.type = $(this).data('param').name;
				self.catid = $(this).data('param').catid;
				self.categoryInstance.create(self.recommendInstance, self);
				self.recommendInstance.returnTop();
			});
			
			//定时清理缓存
			setTimeout(function () {
				self.cache = {};
			}, 60 * 1000);
		},
	};
		
	return LabelRecommend;
});