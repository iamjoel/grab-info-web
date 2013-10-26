define(function(require){
	require('lodash.min');
	require('moment.min');
	require('/public/modules/weatherReport/main.css');
	require('/public/styles/weather-icons/css/weather-icons.min.css');
	require('/public/scripts/jquery.flot'); //chat插件
	require('/public/scripts/jquery.flot.time'); //chat的x轴显示时间，否则只能显示数字

	var tpl = require('/public/modules/weatherReport/main.html#'),
		panelBody;
	panelBody = _.template(tpl);
	$('#weatherReport .panel-body').html(panelBody);

	var	todayWeatherTemp = require('/public/modules/weatherReport/todayWeather.html#');

	
	var cityName = 'suzhou',
		$todayWeatherCont = $('#todayWeather'),
		minTempChartData = [],
		maxTempChartData = [],
		weatherTrendArr = [],
		now = moment(),
		time = now.startOf('day');

	$("[href=#weatherTrendWrap]").click(function(){
		var $this = $(this); 
		if(minTempChartData.length > 0 && !$this.data('hasInit')){
			$('#weatherTrend').height(460).width(570);
			setTimeout(function(){
				initTempTrend(minTempChartData,maxTempChartData);//
				$this.data('hasInit',true);
			},10);
			
		}
	});	
	$.ajax({
		url:'/api/weatherReport/'+ cityName,
		dateType:'json'
	}).done(function(data){
		if(data.code == 1){
			switch(data.data.today.weatherEn){
				case 'sunny':
					data.data.today.icon = 'wi-day-sunny';
					break;
				case 'cloudy':
					data.data.today.icon = 'wi-day-cloudy';
					break;
				case 'rainy':
					data.data.today.icon = 'wi-rain-mix';
					break;
				default:
					data.data.today.icon = 'wi-day-sunny'
			}
			$todayWeatherCont.html(_.template(todayWeatherTemp,data.data.today));
			var trendData = data.data.trend;

			var axisTime = moment(time);
			_.each(trendData,function(each,index){
				maxTempChartData.push([axisTime.valueOf(),each.tempMax]);
				minTempChartData.push([axisTime.valueOf(),each.tempMin]);
				weatherTrendArr.push(each.weather);
				axisTime.add(1,'d');
			});
				
		}else{
			$("#weatherTrend").html('服务器端错误，请刷新页面重试！');
		}
	}).always(function(){
		$('#weatherReport .panel-body').unblock();
	});

	function initTempTrend(minTemp,maxTemp){
		var $weatherTrendWrap = $("#weatherTrend"),
			now = moment();
		$weatherTrendWrap.empty()
		var plot = $.plot("#weatherTrend", [
				{ data: minTemp, label: "最低温度"},
				{ data: maxTemp, label: "最高温度"}
				
			], {
				xaxis: {
				 mode: "time" ,
				 timezone:'browser',
				 tickFormatter:function(date,axix){
				 	date = moment(date);
				 	if(now.isSame(date,'day')){
				 		return '今天'
				 	}else{
				 		return date.format('MM月DD日');
				 	}
				 },
				 minTickSize: [1, "day"]

				},
		 
				tickFormatter:function(tick){
					return tick + 'aaa';
				},
				series: {
					lines: {
						show: true
					},
					points: {
						show: true
					}
				},
				grid: {
					hoverable: true,
					clickable: true
				}
		}); 

		$weatherTrendWrap.on('plothover',function(event, pos, data){
			if(data){
				showTooltip(data.pageX, data.pageY,
					data.datapoint[1] + '℃<br/>' + weatherTrendArr[data.dataIndex]);
			}else{
				hideTooltip();
			} 
		})

		function showTooltip(x, y, contents) {
			$("#weatherTip").remove();
			$("<div id='weatherTip'>" + contents + "</div>").css({
				top: y + 5,
				left: x + 5,
			}).appendTo("body").fadeIn(200);
		} 
		function hideTooltip(){
			$("#weatherTip").remove();
		}

	}


})