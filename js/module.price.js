//价格模块
define(function (require, exports, module) {

	var Stock = require('/js/module.stock.js');
	
	var set = function (cxt) {
		var skus = getSku(cxt, true);
		var stockSku = getSku(cxt);
		if ($.trim(skus).length < 1) return;
		
		$.ajax({
			url: 'http://p.3.cn/prices/mgets?skuIds='+ skus +'&type=1',
			dataType: 'jsonp',
			success: function(r) {
				if (!r && !r.length) {
					return false;
				}
				for (var i = 0; i < r.length; i++) {
					
					if (typeof r[i].id == 'undefined') continue;
				
					var price = parseFloat(r[i].p, 10);
					var sku = r[i].id.split('J_')[1];

					if (price > 0) {
						$('[sku=' + sku + ']', cxt).html('￥' + r[i].p + '');
					} else {
						$('[sku=' + sku + ']', cxt).html('暂无报价');
					}
				}
			}
		})
		
		Stock.queryAction(stockSku);
	};
	
	var getSku = function (cxt, hasPrefix) {
		var skuArr = [];
		$('.price', cxt).each(function () {
			var sku = (hasPrefix ? 'J_' : '') + $(this).attr('sku');
			skuArr.push(sku);
		});
		
		return skuArr.join();
	};
	
	
	module.exports = set;
});