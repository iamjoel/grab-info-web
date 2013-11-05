define(function(require){
	require('lodash.min');
	require('moment.min');
	require('/public/modules/weatherReport/main.css');
	require('/public/styles/weather-icons/css/weather-icons.min.css');
	require('/public/scripts/jquery.flot'); //chat插件
	require('/public/scripts/jquery.flot.time'); //chat的x轴显示时间，否则只能显示数字

	var tpl = require('/public/modules/weatherReport/main.html#');
	var	panelBody;
	panelBody = _.template(tpl);
	$('#weatherReport .panel-body').html(panelBody);

	var	todayWeatherTemp = require('/public/modules/weatherReport/todayWeather.html#');

	
	var cityName = 'suzhou';
	var	$todayWeatherCont = $('#todayWeather');
	var	minTempChartData = [];
	var	maxTempChartData = [];
	var	weatherTrendArr = [];
	var	weatherTrendData = [];
	var	now = moment();
	var	time = now.startOf('day');

	$('[href=#weatherTrendWrap]').click(function(){
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
			data.data.today.icon = getIconClass(data.data.today.weatherEn);
			$todayWeatherCont.html(_.template(todayWeatherTemp,data.data.today));
			var trendData = data.data.trend;
			weatherTrendData = trendData;
			var axisTime = moment(time);
			_.each(trendData,function(each,index){
				maxTempChartData.push([axisTime.valueOf(),each.tempMax]);
				minTempChartData.push([axisTime.valueOf(),each.tempMin]);
				weatherTrendArr.push(each.weather);
				axisTime.add(1,'d');
			});
				
		}else{
			$('#weatherTrend').html('服务器端错误，请刷新页面重试！');
		}
	}).always(function(){
		$('#weatherReport .panel-body').unblock();
	});

	function getIconClass(weatherName){
		var map = {
				sunny :'wi-day-sunny'
				,cloudy :'wi-day-cloudy'
				,rainy :'wi-rain-mix'
			},
			iconClass = map[weatherName] || 'wi-day-sunny';
		return iconClass;
	};
	function initTempTrend(minTemp,maxTemp){
		var $weatherTrendWrap = $('#weatherTrend'),
			now = moment();
		$weatherTrendWrap.empty()
		var plot = $.plot('#weatherTrend', [
				{ data: minTemp, label: '最低温度'}
				,{ data: maxTemp, label: '最高温度'}
				
			], {
				xaxis: {
				 mode: 'time' ,
				 timezone:'browser',
				 tickFormatter:function(date,axix){
				 	date = moment(date);
				 	var weekMap = ['周日','周一','周二','周三','周四','周五','周六']
				 	weekDay = weekMap[date.day()];
				 	if(now.isSame(date,'day')){
				 		return '今天' + '(' +  weekDay + ')';
				 	}else{
				 		return date.format('MM月DD日') + '(' +  weekDay + ')';
				 	}
				 },
				 minTickSize: [1, 'day']

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

		//天气趋势的图表
		var plotData = plot.getData();
		var	chartOffset = $weatherTrendWrap.offset();
		plotData.forEach(function(each){
			if(each.label == '最高温度'){
				var offset,icon;
				// 拿所有点的坐标
				each.data.forEach(function(point,index){
					offset = 
						plot.pointOffset({
							x:point[0],
							y:point[1]
						});
					if(index == 0){
						offset.left += 25;
					}else if(index == each.data.length - 1){
						offset.left-= 30;
					}

					icon = getIconClass(weatherTrendData[index].weatherEn);
					addWeatherIcon(icon,offset.left ,offset.top );
				});
			}
		});

		function addWeatherIcon(icon,x,y){
			$('<div class="weatherTrendIcon '+ icon +'" ></div>').css({
				top: y - 35,
				left: x - 10,
			}).appendTo($weatherTrendWrap);
		};

		// console.log(plot.getData())

		$weatherTrendWrap.on('plothover',function(event, pos, data){
			if(data){
				showTooltip(data.pageX, data.pageY,
					data.datapoint[1] + '℃');
			}else{
				hideTooltip();
			} 
		})

		function showTooltip(x, y, contents) {
			$('#weatherTip').remove();
			$('<div id="weatherTip">' + contents + '</div>').css({
				top: y + 5,
				left: x + 5,
			}).appendTo('body').fadeIn(200);
		} 
		function hideTooltip(){
			$('#weatherTip').remove();
		}

	}


})