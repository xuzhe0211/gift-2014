//倒计时
define(function(require, exports, module) {
	
	var countdown = function (now, end, cf, ef, isPadding, afixValue) {
	
		var baseTime = new Date().getTime();
		
		var run = function () {
			var nowTime = new Date().getTime();
			var fixValue = afixValue || (nowTime - baseTime);
			
			if (Math.abs(fixValue) / 1000 > 2) {
				now = new Date($.ajax({async: false, type: 'head'}).getResponseHeader('Date')).getTime();;
				baseTime = new Date().getTime();
			} else {
				now += fixValue;
				baseTime = nowTime;
			}

			var leaveTime = end - now;

			if (leaveTime > 0) {
				var d = Math.floor(leaveTime / 1000 / 60 / 60 / 24);
				var h = Math.floor(leaveTime / 1000 / 60 / 60 % 24);
				var m = Math.floor(leaveTime / 1000 / 60 % 60);
				var s = Math.floor(leaveTime / 1000 % 60);
				
				if (isPadding) {
					d = d > 9 ? d : '0' + d;
					h = h > 9 ? h : '0' + h;
					m = m > 9 ? m : '0' + m;
					s = s > 9 ? s : '0' + s;
				}
				
				cf(d, h, m, s);
				setTimeout(run, 1000);
			} else {
				ef();
			}
		};
		
		run();
		
	};
	
	return countdown;
});