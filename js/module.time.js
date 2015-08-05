//提醒对象
define(function (require, exports, module) {
	var trimPath = require('jdf/1.0.0/unit/trimPath/1.0.0/trimPath.js');
	var Time = require('/js/module.calendar.js');
	
	var Lunar = Time.Lunar;
	var lunar = Time.lunar;
	var date = new Date($.ajax({async: false, type: 'head'}).getResponseHeader('Date'));
	var calendarTpl = '<div class="h_calendar_box">\
						<div class="h_calendar">\
							<div class="h_calendar_select e_clear">\
								<a href="javascript:;" class="prevYear ctrl-prev">«</a>\
								<a href="javascript:;" class="prevMonth ctrl-prev">‹</a>\
								<div class="dd">\
									<dl id="c-year" data-widget="dropdown" style="cursor: auto;">\
										<dt>\
											<div class="text" val="2013">2013年<b></b></div>\
										</dt>\
										<dd style="height: 60px; overflow-y: auto; overflow-x: hidden;">\
										</dd>\
									</dl>\
									<dl id="c-month" data-widget="dropdown" style="cursor: auto;">\
										<dt><div class="text" val="1">1月<b></b></div></dt>\
										<dd style="height: 150px; overflow-y: auto; overflow-x: hidden;">\
										</dd>\
									</dl>\
								</div>\
								<a href="javascript:;" class="nextYear ctrl-next">»</a>\
								<a href="javascript:;" class="nextMonth ctrl-next">›</a>\
							</div>\
							<div class="h_calendar_week">\
								<ul class="e_clear">\
									<li class="week">日</li>\
									<li>一</li>\
									<li>二</li>\
									<li>三</li>\
									<li>四</li>\
									<li>五</li>\
									<li class="week">六</li>\
								</ul>\
							</div>\
							<div class="h_calendar_list">\
								<ul class="e_clear js-cld-panel" id="calendatPanel">${content}</ul>\
							</div>\
						</div>\
					</div>';
	var Util = {
			date : date,
			currentYear : date.getFullYear(),
			currentMonth : date.getMonth(),
			months : 12,
			yeartpl : '<a val="{val}" href="javascript:;">{val}年</a>',
			monthtpl : '<a val="{val}" href="javascript:;">{val}月</a>',
			$m : $('#c-month dd'),
			$y : $('#c-year dd'),
			isYear : function(that) {
				return that.parent().parent().is('#c-year');
			},
			setMonth : function(month) {
				$('#c-month dt div').attr('val', month).html(month + '月' + '<b></b>')
			},
			getMonth : function() {
				return  $('#c-month dt div').attr('val') - 1;
			},
			setYear : function(year) {
				$('#c-year dt div').attr('val', year).html(year + '年' + '<b></b>')
			},
			getYear : function() {
				return  $('#c-year dt div').attr('val');
			},
			indexOf : function(arr, ele) {
				var indexOf = Array.prototype.indexOf, i = 0, l = arr.length;
				if(indexOf) {
					return arr.indexOf(ele);
				} else {
					for(; i < l; i++) {
						if(arr[i] == ele) {return i;}
					}
					return -1;
				}
			},
			init : function() {
				var yearsarr = [], monthsarr = [], that = this, 
					ty = this.currentYear, tm = this.currentMonth;
				for (var i = this.currentYear, l = i + 1; i <= l; i++) {
					var str = this.yeartpl.replace(/{val}/g, i);
					yearsarr.push(str);
				}
				
				for (var j = 0, size = this.months; j < size; j++) {
					var str = this.monthtpl.replace(/{val}/g, j+1);
					monthsarr.push(str);
				}

				$(this.$y.selector).append(yearsarr.join(''));
				$(this.$m.selector).append(monthsarr.join(''));

				$('#c-year, #c-month').hover(function() {$(this).find('dd').show()}, function() {$(this).find('dd').hide()});
				$('#c-year dd a, #c-month dd a').live('click', function() {
					$(this).parent().hide().find('.selected').removeClass('selected').end().end().addClass('selected');
					that.isYear($(this)) ? that.setYear($(this).attr('val')) : that.setMonth($(this).attr('val'));
					if (typeof _day !== "undefined") _day.reInit();
					$('.prevYear, .nextYear, .prevMonth, .nextMonth').removeClass('gray');
					$('#c-year a.selected').attr('val') == ty ? $('.prevYear').addClass('gray') : $('.nextYear').addClass('gray');
					$('#c-month a.selected').prev().css('display') !== 'block' ? $('.prevMonth').addClass('gray') : $('.prevMonth').removeClass('gray');
					$('#c-month a.selected').next().css('display') !== 'block' ? $('.nextMonth').addClass('gray') : $('.nextMonth').removeClass('gray');
				});
				
				$('#c-year dd').delegate('a', 'click', function() {
					(ty == $('#c-year a.selected').attr('val')) ? ($('#c-month a:lt(' + tm + ')').show(), $('#c-month a:gt(' + tm + ')').hide(), $('#c-month a:first').click())
						: ($('#c-month a:lt(' + tm + ')').hide(), $('#c-month a:gt(' + tm + ')').show(), $('#c-month a:eq(' + tm + ')').click());
				});
				
				this.setDefault();
			},
			setDefault: function () {
				$('#c-year dd a[val=' + (this.currentYear) + ']').click();
				$('#c-month dd a[val=' + (this.currentMonth + 1) + ']').click();
			}
		};

		/**
		 * 日历类
		 * @param {Object} date
		 */
		function Calendar(date){
			this.date = date ? new Date(+date) : (new Date);
		}

		Calendar.prototype = {
			getMonthFirstDate: function(){
				var date = new Date(+this.date);
				date.setDate(1);
				return date;
			},
			getCalendarFirstDate: function(isSundayFirst){
				var date = this.getMonthFirstDate(), day = date.getDay();
				date.setDate(date.getDate() - (isSundayFirst ? day : day == 0 ? -6 : (day - 1)));
				return date;
			}
		};

		function Day() {
			this.date = new Date();
			this.offset = {month : Util.getMonth(), year : Util.getYear()};
			this.date.setMonth(this.offset.month);
			this.date.setYear(this.offset.year);
			this.month = this.date.getMonth();
			this.year = this.date.getFullYear();
			//this.count = new Date(this.year, this.month + 1, 0).getDate();
			this.tpl = '<li class="{monthClass}" date="{date}" ldate="{ldate}"><span class="border"></span><div class="solar_date">{solar}</div><div class="lunar_date">{lunar}</div></li>';
			this.max = 42;
			this.container = [];
			this.times = 1;
			this.cal = new Calendar(this.date);
			this.firstDay = this.cal.getCalendarFirstDate(true);
			this.month_firstDay = this.cal.getMonthFirstDate(true);
			this.month_lastDay = new Date(this.year, this.month + 1, 1);
			this.today = Util.date;
		}

		/**
		 * 单个时间
		 * @return {[type]} [description]
		 */
		Day.prototype = {
			lfday : '初一',
			monthCn: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
			dateCn: ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', '卅一'],
			_class_fix : function(date) {
				var _class = [];
				
				this.times % 7 == 1 && _class.push('lb');
				this.times > 35 && _class.push('bb');
				this.month_firstDay.getTime() > this.firstDay.getTime() && _class.push('last_month');
				this.month_lastDay.getTime() < this.firstDay.getTime() && _class.push('next_month');
				
				this.today.getDate() == this.firstDay.getDate() 
				&& this.today.getDay() == this.firstDay.getDay() 
				&& this.today.getMonth() == this.firstDay.getMonth()
				&& this.today.getFullYear() == this.firstDay.getFullYear() && _class.push('today');
				
				
				this.today.getFullYear() + 1 == this.firstDay.getFullYear()
				&& (this.today.getMonth() < this.firstDay.getMonth() || (this.today.getMonth() == this.firstDay.getMonth() && this.today.getDate() <= this.firstDay.getDate()))
				&& _class.push('disabled');
				
				this.firstDay.getTime() <= this.today.getTime() && _class.push('disabled');
				
				if (date.getFullYear() - this.today.getFullYear() == 2) {
					_class.push('disabled');
				}
				
				return _class.join(' ');
			},
			_format_time : function(y, m, d) {
				var tpl = '{y}-{m}-{d}';
				return tpl.replace(/{y}/g, y).replace(/{m}/g, m + 1).replace(/{d}/g, d);
			},
			format_time : function(m, d) {
				var tpl = '{m}-{d}';
				m = Util.indexOf(this.monthCn, m) + 1;
				d = Util.indexOf(this.dateCn, d) + 1;
				return tpl.replace(/{m}/g, m).replace(/{d}/g, d);
			},
			_create : function() {
				while(this.times <= this.max) {
					var obj = new Lunar(this.firstDay), festival = obj.festival(), y = obj.oDate.getFullYear(),
						m = obj.oDate.getMonth(), d = obj.oDate.getDate(), ld = obj.lDate, lm = obj.lMonth;
						dateHtml = this.tpl.replace(/{monthClass}/g, this._class_fix(obj.oDate))
							.replace(/{date}/g, this._format_time(y, m, d))
							.replace(/{ldate}/g, this.format_time(lm, ld))
							.replace(/{solar}/g, obj.oDate.getDate())
							.replace(/{lunar}/g, festival.length ?  festival[0].desc : obj.lDate == this.lfday ? obj.lMonth + '月' : obj.term ? obj.term : obj.lDate);
					this.container.push(dateHtml);
					this.times++;
					this.firstDay.setDate(this.firstDay.getDate() + 1);
				}
				$('#calendatPanel').empty().append(this.container.join(''));
				$('#calendatPanel li:not(.today)').hover(function() {$(this).toggleClass('date_hover')}, function() {$(this).toggleClass('date_hover')})
			},
			init : function() {
				var that = this;
				this._create();
			},
			createTpl: function () {
				$('body').append(calendarTpl.process({content: ''}));
				Util.init();
			},
			reInit : function() {
				var that =  new Day();
				this._create.call(that);
			}
		}

		function CPos(x, y) {
			this.x = x;
			this.y = y;
		}

		//获取控件的位置
		function getPosition(ele) {
			var target = ele,
				pos = new CPos(target.offsetLeft, target.offsetTop);
			while (target = target.offsetParent)
			{
				pos.x += target.offsetLeft;
				pos.y += target.offsetTop;
			}
			
			return pos;
		}

		$('#remindTime').live('click', function() {
			var ele = $(this).get(0);
			var pos = getPosition(ele);
			$('.h_calendar_box').css({top : pos.y + 35, left : pos.x - 75}).show();
			// Util.setDefault();
		})
		
		//农历 、阳历切换
		$('input[name="dateRadio"]').live('click', function () {
			if ($(this).val() == 1) {
				var date = $('body').data('gdate');
				$('#remindTime').val(date);
			} else {
				var date = $('body').data('ldate');
				$('#remindTime').val(date);
			}
		});

		$('.h_calendar_list ul li:not(.disabled)').live('click', function() {
			var val = $(this).attr('date'), reg = /\-/g, ldate = $(this).attr('ldate'),
				date = val.replace(reg, '/').split('/').slice(1).join('/'),
				_date = $('#dateRadio input:checked').val() == 2 ? ldate.replace(reg, '/') : date;
			$('#remindTime').val(_date).next('.msg').removeClass().addClass('msg ok').parent().removeClass('highlight');
			$('body').data('ldate', ldate);
			$('body').data('gdate', date);
			$('.h_calendar_box').hide();
		})
		
		//快捷方式 tofix: :hidden && :visible 不好用！！！
		$('.prevYear').live('click', function() {var $$ = $('#c-year dd a.selected').prev(); $$.css('display') == 'block' && $$.click()})
		$('.prevMonth').live('click', function() {var $$ = $('#c-month dd a.selected').prev(); $$.css('display') == 'block' && $$.click()})
		$('.nextYear').live('click', function() {var $$ = $('#c-year dd a.selected').next(); $$.css('display') == 'block' && $$.click()})
		$('.nextMonth').live('click', function() {var $$ = $('#c-month dd a.selected').next(); $$.css('display') == 'block' && $$.click()})

		$('body').click(function(g) {
			var d = g.srcElement || g.target,
				connectDom = [$('.h_calendar_box').get(0), $('#remindTime').get(0)];
			while (d) {
				for (var f = 0; f < connectDom.length; f++) {
					if (d == connectDom[f]) {
						return
					}
				}
				if (d === document.body) {
					$('.h_calendar_box').hide();
					return
				}
				d = d.parentNode;
			}
		});
		
		var daytpl = new Day();
		daytpl.createTpl();
		
		var _day = new Day();
		_day.reInit();
});