//首页焦点图模块
seajs.use([
	'/js/module.slider.js'
	], function (Slider){
	
	var slider = new Slider({
		container: '#slide',
		navItem: '.slide-controls>span',
		panel: '.slide-items',
		direction: 'x',
		auto: true,
		autoTime: 4 * 1000,
		changeComplete: function (ele, index) {
			var curEle = $(ele).find('li:eq(' + index + ')');
			curEle.addClass('am-animation-scale-enlarge').siblings().removeClass('am-animation-scale-enlarge');
		}
	});
});

