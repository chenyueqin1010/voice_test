$(function(){

	$('#startRecord').click(function(){
		 start_recorder(function (state) {
			if (state == true) {
				console.log('录音中……');
			}
		});
	});
	$('#stopRecord').click(function(){
		stop_recorder();
		
		var audioData = get_recorder_data();
		var apiKey = "2d54f7bcbb2d41fbba1bbf6dfb391718";
		var time = new Date().getTime();
		var x_param = "eyJlbmdpbmVfdHlwZSI6ICJzbXMxNmsiLCJhdWUiOiAicmF3In0";
		
		$.ajax({
			 headers: {
				'X-Appid': "5ad05bef",
                'X-CurTime': time,
                'X-Param': x_param,
                'X-CheckSum': md5(apiKey+time+x_param),
				'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
			},
			url: "http://api.xfyun.cn/v1/aiui/v1/iat",
			data: {
				"audio": audioData
			},
			type: "post",
			dataType: "jsonp",
			beforeSend: function () {
				console.log("语音识别中……");
			},
			success: function (data) {
				console.log(data);
				/* if (data.status == 1) {
					console.log(data.info);
				} else {
					console.error(data.info);
				} */
			},
			error: function (res) {
				console.log(res);
			},
			complete: function () {
				//console.info("识别完毕！");
			}
		});
	});
	
});

var recorder;
//IE浏览器判断
function isIE(){
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	return !!(msie > 0 || navigator.userAgent.match(/Trident.*rv:11./));
}
//开始录音
function start_recorder(callback) {
	if (isIE()) {
		FWRecorder.configure(16, 100, 0, 0);
		FWRecorder.record('flash-asr', 'flash-asr.wav');
		callback(true);
	} else {
		HZRecorder.get(function (error, rec) {
			if (error) {
				layer.msg(error.message, {icon: 5});
				callback(false);
				return false;
			}
			recorder = rec;
			recorder.start();
			callback(true);
		}, {
			sampleBits: 16,
			sampleRate: 16000
		});
	}
}
//获取录音数据
function get_recorder_data() {
	if (isIE()) {
		return FWRecorder.getBase64('flash-asr');
	} else {
		return recorder.getBase64AudioData();
	}
}
//结束录音
function stop_recorder() {
	if (isIE()) {
		FWRecorder.stopRecording('flash-asr');
	} else {
		recorder.stop();
	}
}