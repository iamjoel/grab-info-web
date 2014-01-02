define(function(require){
  	var config = require('script/config');
	require('lib/lodash.min');
	require('lib/moment.min');
	require('weatherReport/main.css');
	require('/public/styles/weather-icons/css/weather-icons.min.css');
	require('scripts/jquery.flot'); //chat插件
	require('scripts/jquery.flot.time'); //chat的x轴显示时间，否则只能显示数字
	require('scripts/jquery.echarts-plain');

	var $root = $('#weatherReport');
	var tpl = require('weatherReport/main.html#');
	var	panelBody;
	$root.append(tpl);
	panelBody = _.template($('.mainTemp', $root).html());
	$('#weatherReport .panel-body').html(panelBody);
	
	var cityName = 'suzhou';
	var	$todayWeatherCont = $('#todayWeather');
	var	now = moment();

	var todayWeatherData;
	var weatherTrendData;
	var currentTab = 'todayWeather';

	getWeatherData(cityName,function(){
		renderTodayWeatherReport(todayWeatherData);
	});
	registerEvent();

	
	function registerEvent(){

		$('[href=#todayWeather]',$root).click(function(){
			currentTab = 'todayWeather';
			renderTodayWeatherReport(todayWeatherData);
		});

		$('[href=#weatherTrendWrap]',$root).click(function(){
			currentTab = 'weatherTrend';
			var $this = $(this); 
			if(!$this.data('hasInit')){
				setTimeout(function(){
					renderWeatherTrendReport(weatherTrendData);
					$this.data('h²asInit',true);
				},10);
				
			}
		});	


		$('[href=#PM25Wrap]',$root).click(function(){
			currentTab = 'PM25';
			rederPM25();
			//http://www.pm25.in/api/querys/pm2_5.json?city=suzhou&token=5j1znBVAsnSf5xQyNQyq
		});

		$('.refreshBtn',$root).click(function(){
			getWeatherData(cityName, function(data){
				if(currentTab == 'todayWeather'){
					renderTodayWeatherReport(todayWeatherData);
				} else if(currentTab == 'weatherTrend'){
					renderWeatherTrendReport(weatherTrendData);
				} else {
					rederPM25();
				}
			});
		});


	};
	function getWeatherData(cityName, callback){
		$.ajax({
			url: config.URL.weather+ cityName
			, dateType: 'json'
		})
		.done(function(data){
			todayWeatherData = false;
			weatherTrendData = false;

			if(data.code == 1){
				data.data.today.icon = getIconClass(data.data.today.weatherEn);
				todayWeatherData = data.data.today;

				weatherTrendData = formatWeatherTrendData(data.data.trend);
			}

			if(callback && _.isFunction(callback)){
				callback();
			}

		})
		.fail(function(){
			$('#todayWeather,#weatherTrendWrap').text('服务器端错误,请稍后重试！');
		})
		.always(function(){
			$('.panel-body',$root).unblock();
		});

	};

	function renderTodayWeatherReport(data){
		if(data){
			var	todayWeatherTemp = $('.todayWeatherTemp', $root).html();
			$todayWeatherCont.html(_.template(todayWeatherTemp,data));
		}else{
			//错误信息
		}

		
	};
	
	function formatWeatherTrendData(data){
		var formattedData;
		var minArr = [];
		var maxArr = [];
		var weatherEnArr = [];
		var weatherTrendArr = [];
		var	time = now.startOf('day');
		var axisTime = time.clone();
		_.each(data,function(each,index){
			var min = Number(each.tempMin);
			var max = Number(each.tempMax);
			var temp;
			// 接口有时返回的 tempMin > tempMax...
			if(min > max){
				temp = min;
				min = max;
				max = temp;
			}

			minArr.push([axisTime.valueOf(),min]);
			maxArr.push([axisTime.valueOf(),max]);
			weatherEnArr.push(each.weatherEn);
			weatherTrendArr.push(each.weather);
			axisTime.add(1,'d');
		});
		formattedData = {
			minArr : minArr
			, maxArr : maxArr
			, weatherEnArr : weatherEnArr
			, weatherTrendArr : weatherTrendArr
		}
		return formattedData;
	};
	function renderWeatherTrendReport(data){
		var $weatherTrendWrap = $('#weatherTrend');
		var	now = moment();

		$weatherTrendWrap.empty();
		if(data){
			$('#weatherTrend').height(460).width(570);
				var weekMap = ['周日','周一','周二','周三','周四','周五','周六']
				var plot = $.plot('#weatherTrend', [
						{ data : data.minArr, label: '最低温度'}
						, { data : data.maxArr, label: '最高温度'}
					], {
						xaxis: {
						 mode: 'time' ,
						 timezone:'browser',
						 tickFormatter:function(date,axix){
						 	date = moment(date);
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

				//天气趋势的天气图标
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
								offset.left -= 30;
							}

							icon = getIconClass(data.weatherEnArr[index]);
							addWeatherIcon(icon,offset.left ,offset.top );
						});
					}
				});
		}else{

		}

	 

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
	};

	function rederPM25() {
		var url = config.URL.weather + 'PM25/' + cityName;
		$.ajax({
			url : url
			, dataType : 'json'
		}).done(function(data){
			$('#PM25').html(_.template($('.PM25Temp').html(),{
				data : data.data
			}));
		});
	}

	function getIconClass(weatherName){
		var map = {
				sunny :'wi-day-sunny'
				,cloudy :'wi-day-cloudy'
				,rainy :'wi-rain-mix'
			},
			iconClass = map[weatherName] || 'wi-day-sunny';
		return iconClass;
	};


})