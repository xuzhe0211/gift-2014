//查询库存模块
define(function (require, exports, module) {

	var Stock = {
		province: {"北京": { id: "1", c:72 },"上海": { id: "2", c:78 },"天津": { id: "3", c:51035 },"重庆": { id: "4", c:113 },"河北": { id: "5", c:142 },"山西": { id: "6", c:303 },"河南": { id: "7", c:412 },"辽宁": { id: "8", c:560 },"吉林": { id: "9", c:639 },"黑龙江": { id: "10", c:698 },"内蒙古": { id: "11", c:799 },"江苏": { id: "12", c:904 },"山东": { id: "13", c:1000 },"安徽": { id: "14", c:1116 },"浙江": { id: "15", c:1158 },"福建": { id: "16", c:1303 },"湖北": { id: "17", c:1381 },"湖南": { id: "18", c:1482 },"广东": { id: "19", c:1601 },"广西": { id: "20", c:1715 },"江西": { id: "21", c:1827 },"四川": { id: "22", c:1930 },"海南": { id: "23", c:2121 },"贵州": { id: "24", c:2144 },"云南": { id: "25", c:2235 },"西藏": { id: "26", c:2951 },"陕西": { id: "27", c:2376 },"甘肃": { id: "28", c:2487 },"青海": { id: "29", c:2580 },"宁夏": { id: "30", c:2628 },"新疆": { id: "31", c:2652 },"台湾": { id: "32", c:2768 },"香港": { id: "42", c:2754 },"澳门": { id: "43", c:2770 },"钓鱼岛": { id: "84", c:84 }},
		queryAction: function (skuid) {
			this.getAreaid(function (areaid, pname) {
				$.getJSON('/stock/mget', {skuIds: skuid, area: areaid}, function (result) {	
					var data = result.data || [];
				
					for (var i = 0, l = data.length; i < l; i++) {
						var obj = data[i];
						var sku = obj.skuId;
						var stockStateDesc = obj.stockStateDesc;
						var ele = $('strong[sku=' + sku + ']').parent();
						
						ele.find('.stockStatus').remove();
						ele.prepend('<div class="stockStatus">' + pname + stockStateDesc + '</div>');
					}
				});
			});
		},
		getAreaid: function (callback) {
			var self = this;
			var setAreaid = function (areaid) {
				var arr = [];
				for (var i = 0, l = areaid.length; i < l; i++) {
					areaid[i] > 0 && arr.push(areaid[i]);
				}
				
				return arr.join('_');
			};
			
			$.getJSON('http://uprofile.jd.com/u/getadds?callback=?', function (result) {
				var cacheAreaid = getCookie('ipLoc-djd');
				var serverAreaid = result.adds;
				var pvalue;
				var pname;
			
				if (cacheAreaid) {
					pvalue = cacheAreaid.split('-')[0];
					pname = self.getName('id', pvalue);
					cacheAreaid = setAreaid(cacheAreaid.split('-'));
					return callback(cacheAreaid, pname);
				}
				
				pvalue = serverAreaid.split('-')[0];
				pname = self.getName('id', pvalue);
				serverAreaid = setAreaid(serverAreaid.split('-'));
				callback(serverAreaid, pname);
			});
		},
		getName: function (k, v) {
			for (var item in this.province) {
				var obj = this.province[item];
				if (obj.hasOwnProperty(k) && obj[k] == v) {
					return item;
				}
			}
			
			return '';
		}
	};

	module.exports = Stock;
});