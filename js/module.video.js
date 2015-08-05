//视频模块
define(function (require, exports, module) {
	var dialog = require('jdf/1.0.0/ui/dialog/1.0.0/dialog');
	var Video = function (opts) {
		var id = opts.id + '_' + new Date().getTime();
		opts = $.extend({
			//控制条
			controls: false,
			//自动播放
			autoplay: true,
			//预加载
			preload: 'auto',
			//The poster attribute sets the image that displays before the video begins playing
			poster: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/i/loading.gif',
			//循环播放
			loop: true,
			//width of the video
			width: 1210,
			//height of the video
			height: 360,
			language: 'zh',
			swf: 'http://misc.360buyimg.com/user/gift/widget/video/video-js.swf',
			tpl: '<video id="' + id + '" class="video-js vjs-default-skin">\
				  <source src="'+ opts.mp4src +'" type="video/mp4" />\
				</video>'
		}, opts);
		
		videojs.options.flash.swf = opts.swf;
		videojs.addLanguage("zh", {
			"Play": "播放",
			"Pause": "暂停",
			"Current Time": "当前时间",
			"Duration Time": "时长",
			"Remaining Time": "剩余时间",
			"Stream Type": "媒体流类型",
			"LIVE": "直播",
			"Loaded": "加载完毕",
			"Progress": "进度",
			"Fullscreen": "全屏",
			"Non-Fullscreen": "退出全屏",
			"Mute": "静音",
			"Unmuted": "取消静音",
			"Playback Rate": "播放码率",
			"Subtitles": "字幕",
			"subtitles off": "字幕关闭",
			"Captions": "内嵌字幕",
			"captions off": "内嵌字幕关闭",
			"Chapters": "节目段落",
			"You aborted the video playback": "视频播放被终止",
			"A network error caused the video download to fail part-way.": "网络错误导致视频下载中途失败。",
			"The video could not be loaded, either because the server or network failed or because the format is not supported.": "视频因格式不支持或者服务器或网络的问题无法加载。",
			"The video playback was aborted due to a corruption problem or because the video used features your browser did not support.": "由于视频文件损坏或是该视频使用了你的浏览器不支持的功能，播放终止。",
			"No compatible source was found for this video.": "无法找到此视频兼容的源。",
			"The video is encrypted and we do not have the keys to decrypt it.": "视频已加密，无法解密。"
		});
		
		$('body').dialog({
			title: '京东礼品购宣传片',
			width: opts.width,
			heigth: opts.height + 500,
			source: opts.tpl,
			onReady: function () {
				videojs(id, opts, function () {
					this.play();
					opts.onReady();
				});
			}
		});

	};
		
	module.exports = Video;
});