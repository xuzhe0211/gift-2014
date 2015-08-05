//返回顶部和用户调查
define(function (require, exports, module) {
	
	//返回顶部
	var goTopAndSurvey = '<div class="backpanel-gift">\
							<div class="backpanel-inner">\
								<div class="bp-item bp-item-survey">\
									<a href="http://surveys.jd.com/index.php?r=survey/index/sid/488883/lang/zh-Hans" class="survey" target="_blank">调查问卷</a>\
								</div>\
								<div class="bp-item bp-item-backtop">\
									<a href="#none" class="backtop" target="_self">返回顶部</a>\
								</div>\
							</div>\
						</div>';
						
	var bindEvent = function () {
		var topValue = $('.chooseGift').offset().top;
		var winH = $(window).height();
		var ele = $('.bp-item-backtop');
		
		//返回顶部
		ele.click(function () {
			$('html, body').animate({scrollTop: topValue}, 500);
		});
		
		$(window).bind('scroll', function () {
			var scrollTop = $(document).scrollTop();
			//if (topValue < winH + scrollTop) {
			if (topValue < scrollTop) {
				ele.fadeIn();
			} else {
				ele.fadeOut();
			}
		});
	};
	
	exports.init = function () {
		$('body').append(goTopAndSurvey);
		bindEvent();
	};
});