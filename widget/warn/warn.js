//送礼提醒模块
seajs.use([
	'/js/module.calendar.js'
	,'/js/module.remind.js'
	,'jdf/1.0.0/unit/trimPath/1.0.0/trimPath.js'
	,'/js/module.time.js'
	,'/js/module.scrollbar.js'
	,'/js/module.login.js'
	], function (Calendar, Remind, trimPath, Time, Scrollbar, jUser){
	
	/***
	*#字段说明
	*#greOrlun: gre阳历 lun阴历  commonYn=1未设置提醒
	***/
	var remindHandle = {
		tpl: '{for item in data}\
				{if item.commonYn == 1}\
					<li class="item" year="${item.year}">\
				{elseif}\
					<li class="item already-set" year="${item.year}">\
				{/if}\
					<dl>\
						<dt>\
							<b class="red"></b>\
						</dt>\
						<dd>\
							<div class="corner corner-left">\
								<b class="b1"></b>\
								<b class="b2"></b>\
							</div>\
							<div class="date">\
								${item.gregorianMonth}月${item.gregorianDay}日\
							</div>\
							<div class="festival">\
								${item.name}\
							</div>\
							<div class="operate" info="{id: ${item.id}, name: ${item.name}, oTime: ${item.oTime}, ldate: ${item.lunMonth}/${item.lunDay}, month: ${item.gregorianMonth}, day: ${item.gregorianDay}, datetype: ${item.greOrlun}}">\
								<a href="javascript:;" class="set-remind">\
									设置提醒\
								</a>\
								<a href="javascript:;" class="edit hide">\
									编辑\
								</a>\
								<a href="javascript:;" class="del hide">\
									删除\
								</a>\
							</div>\
						</dd>\
					</dl>\
				</li>\
			{/for}',
		gapTpl: '<li class="item"><div class="prompt"><div class="text">欧耶，<span>${year}</span>年到了</div><div class="line"></div></div></li>',
		sendReq: function (opt) {
			$.ajax({
				url: opt.url,
				dataType: 'jsonp',
				data: opt.data || {},
				success: function (result) {
					opt.success(result);
				},
				error: function (a, b, c) {
					console.info(a, b, c)
				}
			});
		},
		//初始化列表
		initList: function () {
			var self = this;
			this.sendReq({
				url: '/remind/remind/list',
				success: function (result) {
					var now = new Date($.ajax({async: false, type: 'head'}).getResponseHeader('Date'));
					var y = now.getFullYear(), m = now.getMonth(), d = now.getDate(), yearIndex, scrollbar;
					now = new Date(y, m, d).getTime(), isSort = false;
					$.each(result, function (i) {
						var time = new Date(y, this.gregorianMonth - 1, this.gregorianDay).getTime();
						//增加year字段
						if (now <= time) {
							$.extend(this, {year: y});
							!isSort && (yearIndex = i);
							isSort = true;
						} else {
							$.extend(this, {year: y + 1});
						}
						//保留原有字段
						$.extend(this, {oTime: this.lunMonth !== null ? this.lunMonth + '/' + this.lunDay : this.gregorianMonth + '/' + this.gregorianDay});
						//增加农历字段
						if (this.greOrlun == 1) {
							var translateTime = Calendar.getLunarDay(this.year, this.gregorianMonth, this.gregorianDay);
							$.extend(this, {lunMonth: translateTime.m, lunDay: translateTime.d});
						}
					});
					result = result.concat(result.splice(0, yearIndex));
					$('.list-item').empty().append(self.tpl.process({data: result}));
					$('[year=' + (y + 1) + ']:first').before(self.gapTpl.process({year: y + 1}));
					self.bindEvent();
					scrollbar = new Scrollbar({controledParentEle: '.list-con', controledEle: '.list-item'});
				},
			});
		},
		//自定义设置
		customReind: function () {
			var self = this;
			$('#jCustomSet').click(function () {
			
				jUser.checkLogin(function (loginStatus) {
					
					if (loginStatus) {
						var remind = new Remind();
						remind.create({
							complete: function () {
								return self.initList.call(remindHandle);
							},
							time: ' '
						});
						$('body').removeData('ldate').removeData('gdate');
					} else {
						jUser.login($.noop, true);
					}
					
				});

			});
		},
		//固定节日设置
		setRemind: function () {
			var self = this;
			$('.operate').delegate('.set-remind', 'click', function (e) {
				
				jUser.checkLogin(function (loginStatus) {
				
					if (loginStatus) {
						var remind = new Remind(), info = $(e.target).parent().attr('info');
						remind.set({
							festivalId: self._getValue('id', info),
							isTraditional: true,
							scenes: self._getValue('name', info),
							type: self._getValue('datetype', info),
							time: self._getValue('oTime', info),
							complete: function () {
								return self.initList.call(remindHandle);
							}
						});
						$('body').data('ldate', self._getValue('ldate', info));
						$('body').data('gdate', self._getValue('month', info) + '/' + self._getValue('day', info));
					} else {
						jUser.login($.noop, true);
					}
				});
			
			});

		},
		//编辑提醒
		editRemind: function () {
			var self = this;
			$('.operate').delegate('.edit', 'click', function (e) {
			
				jUser.checkLogin(function (loginStatus) {
				
					if (loginStatus) {
						var remind = new Remind(), info = $(e.target).parent().attr('info');
						self.sendReq({
							url: '/remind/remind/preedit',
							data: {id: self._getValue('id', info)},
							success: function (result) {
								$.extend(result, {
									time: self._getValue('oTime', info),
									isTraditional: result.festivalId !== null,
									complete: function () {
										return self.initList.call(remindHandle);
									}
								})
								remind.edit(result);
							}
						})
						$('body').data('ldate', self._getValue('ldate', info));
						$('body').data('gdate', self._getValue('month', info) + '/' + self._getValue('day', info));
					} else {
						jUser.login($.noop, true);
					}
				});

			});
		},
		//删除提醒
		removeRemind: function () {
			var self = this;
			$('.operate').delegate('.del', 'click', function (e) {
			
				jUser.checkLogin(function (loginStatus) {
				
					if (loginStatus) {
						var remind = new Remind(), info = $(e.target).parent().attr('info');
						remind.del({
							id: self._getValue('id', info),
							complete: function () {
								return self.initList.call(remindHandle);
							}
						});
					} else {
						jUser.login($.noop, true);
					}
				});

			});
		},
		_getValue: function (key, str) {
			var reg = new RegExp("(^{| )" + key + ":([^,]*)(,|}$)");
			return $.trim(str.match(reg)[2]) || null;
		},
		init: function () {
			this.initList();
		},
		bindEvent: function () {
			$('#reminder-list ul li.already-set').hover(function() {
				$(this).find('a.edit, a.del').show();
			}, function() {
				$(this).find('a.edit, a.del').hide();
			});
			this.setRemind();
			this.editRemind();
			this.removeRemind();
			this.customReind();
		}
	};
	
	remindHandle.init();
});