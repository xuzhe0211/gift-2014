//首页送礼排行、店铺模块
seajs.use([
	'/js/module.tab.js'
	,'/js/module.price.js'
	], function (Tab, Price){
	
	var tab1 = new Tab({
		container: '#choice',
		navItem: '[data-widget="tab-item"]>.mt',
		panel: '[data-widget="tab-content"]',
		hasParent: true,
		complete: function (ele, index) {
			Price(ele, index);
		}
	});
	
	var tab2 = new Tab({
		container: '[sdata-widget="tabs"]',
		navItem: '[sdata-widget="tab-item"]',
		panel: '.subtabcon',
		delay: 100,
		complete: function (ele, index) {
			$(ele).show().siblings('.subtabcon').hide();
			Price(ele, index);
		}
	});
	
	var tab3 = new Tab({
		container: '[gdata-widget="tabs"]',
		navItem: '[gdata-widget="tab-item"]',
		panel: '.subtabcon',
		delay: 100,
		complete: function (ele, index) {
			$(ele).show().siblings('.subtabcon').hide();
			Price(ele, index);
		}
	});
	
	var bindEvent = function () {
		//店铺
		$('#shops .item').hover(function () {
			$(this).addClass('hover');
		}, function () {
			$(this).removeClass('hover');
		});
	}();

});

