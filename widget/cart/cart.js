var handlers = {};
var timerVidea;
var EventUtil = {
    addHandler:function(element,type,handler){
        if(element.addEventListener){
            element.addEventListener(type,handler,false)
        }else if(element.attachEvent){
            element.attachEvent("on"+type,handler);
        }else{
            element["on"+type] = handler;
        }
    },
    removeHandler:function(element,type,handler){
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent("on"+type,handler);
        }else{
            element["on"+type] = null;
        }
    }
}
var draw = {                                  
    paper: null,
    init: function(options){
        //初始化Raphael画布
        this.paper = Raphael("bg", 90, 90);
        //把底图先画上去
        this.paper.image("http://misc.360buyimg.com/user/gift/widget/cart/i/progressBg.png", 0, 0, 90, 90);
        //进度比例，0到1，在本例中我们画65%
        //需要注意，下面的算法不支持画100%，要按99.99%来画
        var percent = options,
            drawPercent = percent >= 1 ? 0.9999 : percent;
        //开始计算各点的位置，见后图
        //r1是内圆半径，r2是外圆半径
        var r1 = 34, r2 = 44, PI = Math.PI,
            p1 = {
                x:46,
                y:89
            },
            p4 = {
                x:p1.x,
                y:p1.y - r2 + r1
            },
            p2 = {
                x:p1.x + r2 * Math.sin(2 * PI * (1 - drawPercent)),
                y:p1.y - r2 + r2 * Math.cos(2 * PI * (1 - drawPercent))
            },
            p3 = {
                x:p4.x + r1 * Math.sin(2 * PI * (1 - drawPercent)),
                y:p4.y - r1 + r1 * Math.cos(2 * PI * (1 - drawPercent))
            },
            path = [
                'M', p1.x, ' ', p1.y,
                'A', r2, ' ', r2, ' 0 ', percent > 0.5 ? 1 : 0, ' 1 ', p2.x, ' ', p2.y,
                'L', p3.x, ' ', p3.y,
                'A', r1, ' ', r1, ' 0 ', percent > 0.5 ? 1 : 0, ' 0 ', p4.x, ' ', p4.y,
                'Z'
            ].join('');
        //用path方法画图形，由两段圆弧和两条直线组成，画弧线的算法见后
        this.paper.path(path)
            //填充渐变色，从#3f0b3f到#ff66ff
            .attr({"stroke-width":0.5, "stroke":"#e43639", "fill":"90-#e43639-#e43639"});
        //显示进度文字
        $("#txt").text(Math.round(percent * 100) + "%");
    }
};
handlers.fileQueueError = function(file, errorCode, message) {
    switch(errorCode){
        case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
          alert("视频文件过大，请选择60MB以下视频文件");
          break;
        case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
          alert("上传格式错误，请选择常用视频格式");
          break;
        case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
            alert("视频文件为空，请选择视频文件");
            break;
        default:
           alert("请选择视频文件");
    }
};

handlers.fileDialogComplete = function(selectedNum, queuedNum) {
    if (queuedNum > 0) {//选择并添加到上传队列的文件数大于0
        var that = this;
        $.ajax({
              type: "POST",
              url: 'http://cart.gift.jd.com/cart/dynamic/beginPCUploadCart.action?callback=?',
              success : function(result){
                    var result = eval('(' + result + ')');
                    if(result.resultCode == 200){
                       that.startUpload();
                         // this.startUpload();//开始上传
                        // this.setButtonDisabled(true);//禁用上传按钮
                    }else{
                        // that.uploadError();
                        uploadError();
                    }
                }
        }); 
    }
};
handlers.uploadStart = function(file) {
    $('.upload_btn_wrap').addClass('upload_hide');
    $('.upload_plan').show();
};
handlers.uploadProgress = function(file, bytesLoaded, bytesTotal) {
    percent = 0;
    percent = Math.ceil((bytesLoaded / bytesTotal) * 100*0.7)/100;
    draw.init(percent);
    if(percent == 0.7){
        clearInterval(timerVidea);
        timerVidea = setInterval(function(){
            percent += 0.01;
            draw.init(percent);
            if(percent >= 1){
                draw.init(0.99);
                clearInterval(timerVidea);
            }
        },900)
    }
};
handlers.uploadSuccess = function(file, serverData) {
    // Math.random() http://cart.gift.jd.com/cart/dynamic/getPCVideoProgress.action?progressUrl=xxx&videoId=xxx
    clearInterval(timerVidea);
    var result = eval('(' + serverData + ')');
    if(result.resultCode == 200){
        draw.init(1);
        $('.upload_plan').hide();
        $('.pcUpload .upload_win').show();
        $('.mcont .upload_win').show().siblings().hide();
        $("#toSettlement").removeClass('disabled').attr("href","javascript:goToOrder();");
    }else{
        // this.uploadError();
        uploadError()
    }
};
handlers.uploadComplete = function(file) {
    // this.setButtonDisabled(false);//恢复上传按钮
};
handlers.uploadError = function(file, errorCode, message) {
    // alert('上传错误，请重新上传');
    // location.reload() 
};
function uploadError(){
    alert('上传错误，请重新上传');
    location.reload() 
}
function callbackTurn(e){
    var msg = '刷新操作会丢失当前已上传视频信息，需重新上传，是否继续？'
    var flag1 = $('#videoUrl').val();
    var flag2 = $('#imageUrl').val();
    if(!!flag1 && !!flag2){
        if(e){
            e.returnValue = msg;
        }
        return msg;
    } 
}
EventUtil.addHandler(window,"beforeunload",callbackTurn);
// window.onbeforeunload = function(){ return '将丢失未保存的数据!'; } 
// window.onbeforeunload = function(e){
$(function(){
    $(window).bind("scroll",function(){
        var top=document.body.scrollTop||document.documentElement.scrollTop;
        if(top>0){
            // _this.obj.show();
            $('.backpanel').show();
        }else{
            // _this.obj.hide();
            $('.backpanel').hide();
        }
    });
    $('.backpanel .backtop').livequery('click',function(){
        $("body,html").animate({scrollTop: 0}, 100);
    });
    $('#toSettlement').livequery('click',function(){
        EventUtil.removeHandler(window,"beforeunload",callbackTurn);
    })
    $('.letter_pic ul li').livequery('click',function(){
        var pid = $('.letter_pic ul').find('.curr').attr('data-url');
        var pid_new = $(this).attr('data-url');
        var index = $('.letter_pic ul li').index(this);
        var oBimg = $(this).parents('.letter_pic').find('.letter-img');
        var ptype = 1;
        var targetId = 0;
        var key;
        if(index == $('.letter_pic ul li').index($('.letter_pic ul .curr')) || $(this).hasClass('disabled')){
            return false;
        }
        $('div[data-bind="Package"]').attr('value',pid_new);
        $(this).addClass('curr').siblings().removeClass('curr');
        oBimg.find('a').attr('href',$(this).attr('data-url'));
        oBimg.find('img').attr('src',$(this).attr('data-bigImg'));
        // console.log('pid:'+pid+',pid_new:'+pid_new);
        //把商品移到未选中购物车
        cancelItem(pid, ptype, targetId);
        //把商品移到选中购物车
        selectItem(pid_new, ptype, targetId);
    })
    $('.videoUpload .mt span').livequery('click',function(){
        if($(this).hasClass('disabled')) return false;
        $(this).addClass('curr').siblings().removeClass('curr');
        $('.'+$(this).attr('data-class')).show().siblings('.Upload').hide();
    });
	
	//默认选中PC上传  time:2015.1.14 业务紧急需求
	var setTimer = function (isBreak, func) {
		var timer = setInterval(function () {
			isBreak() && (clearInterval(timer), func());
		}, 500);
	}
	
	setTimer(function () {
		return $('.videoUpload .mt span[data-class]').size();
	}, function () {
		var mobileEle = $('.videoUpload .mt span[data-class]:first');
		var pcEle = $('.videoUpload .mt span[data-class]:last');
		var pcElePanelClass = pcEle.attr('data-class');
		
		pcEle.after(mobileEle);
		pcEle.addClass('curr');
		mobileEle.removeClass('curr');
		$('.' + pcElePanelClass).show().siblings('.Upload').hide();
	});
});