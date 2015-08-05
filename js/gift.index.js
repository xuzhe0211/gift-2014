/**
* @main
*/
seajs.use([
	'jdf/1.0.0/unit/globalInit/1.0.0/globalInit'
	,'jdf/1.0.0/ui/lazyload/1.0.0/lazyload'
	,'/js/module.recommendView.js'
	,'/js/module.video.js'
	,'/js/module.lazyload.js'
	,'/js/module.goTop.js'
	], function (globalInit, lazyload, RecommendView, Video, LazyLoad, goTop) {
	
	var lazy = new LazyLoad({
		selector: 'img[data-original]',
		effect: 'fadeIn',
		error: function () {
			$(this).attr('src', 'http://misc.360buyimg.com/lib/img/e/blank.gif').addClass('err-product');
		}
	});
	
	//创建播放器
	$('.gifts-video').bind('click', function () {
		var video = new Video({
			id: 'gift-video',
			autoplay: false,
			mp4src: (location.origin || 'http://gift.jd.com') + '/public/JDLPG.mp4',
			height: $(window).height() * 0.85,
			width: $(window).width() * 0.65,
			onReady: function () {
				$('.ui-dialog').css({'position': 'fixed', 'top': '50%', 'marginTop': -1 * $('.ui-dialog').height() / 2});
			}
		});
	});
	
	var recommend = new RecommendView({lazyload: lazy});
	
	goTop.init();

});