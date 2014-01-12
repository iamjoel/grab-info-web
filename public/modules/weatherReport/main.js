define(function(require) {
	var config = require('script/config');
	require('lib/lodash.min');
	require('lib/moment.min');
	require('weatherReport/main.css');
	require('/public/styles/weather-icons/css/weather-icons.min.css');
	require('scripts/echarts-plain-map');

	var $root = $('#weatherReport');
	var tpl = require('weatherReport/main.html#');
	var panelBody;
	$root.append(tpl);
	panelBody = _.template($('.mainTemp', $root).html());
	$('#weatherReport .panel-body').html(panelBody);

	var cityName = 'suzhou';
	var $todayWeatherCont = $('#todayWeather');
	var now = moment();

	var todayWeatherData;
	var weatherTrendData;
	var currentTab = 'todayWeather';

	getWeatherData(cityName, function() {
		renderTodayWeatherReport(todayWeatherData);
	});
	registerEvent();


	function registerEvent() {

		$('[href=#todayWeather]', $root).click(function() {
			currentTab = 'todayWeather';
			renderTodayWeatherReport(todayWeatherData);
		});

		$('[href=#weatherTrendWrap]', $root).click(function() {
			currentTab = 'weatherTrend';
			var $this = $(this);
			if (!$this.data('hasInit')) {
				setTimeout(function() {
					renderWeatherTrendReport(weatherTrendData);
					$this.data('h²asInit', true);
				}, 10);

			}
		});


		$('[href=#PM25Wrap]', $root).click(function() {
			currentTab = 'PM25';
			rederPM25();
			//http://www.pm25.in/api/querys/pm2_5.json?city=suzhou&token=5j1znBVAsnSf5xQyNQyq
		});

		$('.refreshBtn', $root).click(function() {
			getWeatherData(cityName, function(data) {
				if (currentTab == 'todayWeather') {
					renderTodayWeatherReport(todayWeatherData);
				} else if (currentTab == 'weatherTrend') {
					renderWeatherTrendReport(weatherTrendData);
				} else {
					rederPM25();
				}
			});
		});


	};

	function getWeatherData(cityName, callback) {
		$.ajax({
			url: config.URL.weather + cityName,
			dateType: 'json'
		})
			.done(function(data) {
				todayWeatherData = false;
				weatherTrendData = false;

				if (data.code == 1) {
					data.data.today.icon = getIconClass(data.data.today.weatherEn);
					todayWeatherData = data.data.today;

					weatherTrendData = formatWeatherTrendData(data.data.trend);
				}

				if (callback && _.isFunction(callback)) {
					callback();
				}

			})
			.fail(function() {
				$('#todayWeather,#weatherTrendWrap').text('服务器端错误,请稍后重试！');
			})
			.always(function() {
				$('.panel-body', $root).unblock();
			});

	};

	function renderTodayWeatherReport(data) {
		if (data) {
			var todayWeatherTemp = $('.todayWeatherTemp', $root).html();
			$todayWeatherCont.html(_.template(todayWeatherTemp, data));
		} else {
			//错误信息
		}


	};

	function formatWeatherTrendData(data) {
		var formattedData;
		var minArr = [];
		var maxArr = [];
		var weatherEnArr = [];
		var weatherTrendArr = [];
		var time = now.startOf('day');
		var axisTime = time.clone();
		_.each(data, function(each, index) {
			var min = Number(each.tempMin);
			var max = Number(each.tempMax);
			var temp;
			// 接口有时返回的 tempMin > tempMax...
			if (min > max) {
				temp = min;
				min = max;
				max = temp;
			}

			minArr.push(min);
			maxArr.push(max);
			weatherEnArr.push(each.weatherEn);
			weatherTrendArr.push(each.weather);
			axisTime.add(1, 'd');
		});
		formattedData = {
			minArr: minArr,
			maxArr: maxArr,
			weatherEnArr: weatherEnArr,
			weatherTrendArr: weatherTrendArr
		}
		return formattedData;
	};

	function renderWeatherTrendReport(data) {
		if (!data) {
			return;
		}
		var $weatherTrendWrap = $('#weatherTrend');
		$weatherTrendWrap.height(460).width(570);
		var now = moment();

		$weatherTrendWrap.empty();
		var weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
		var showDayNums = data.minArr.length;
		var xAxis = [];
		for (var showDate = new moment(), i = 0; i < showDayNums; i++) {
			var weekDay = weekMap[showDate.day()];
			if (i == 0) {
				xAxis.push('今天' + '(' + weekDay + ')');
			} else {
				xAxis.push(showDate.format('MM月DD日'));
			}
			showDate.add(1, 'd');
		}
		var chart = echarts.init($weatherTrendWrap[0]);
		chart.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['最低温度', '最高温度']
			},
			toolbox: {
				show: true,
				feature: {
					mark: true,
					dataView: {
						readOnly: false
					},
					magicType: ['line', 'bar'],
					restore: true,
					saveAsImage: true
				}
			},
			xAxis: [{
				type: 'category',
				boundaryGap : false,
				data: xAxis
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				}
			}],
			series: [{
				name: '最低温度',
				type: 'line',
				data: data.minArr
			}, {
				name: '最高温度',
				type: 'line',
				data: data.maxArr
			}]
		});
		
	};

	function rederPM25() {
		var url = config.URL.weather + 'PM25/' + cityName;
		$.ajax({
			url: url,
			dataType: 'json'
		}).done(function(data) {
			$('#PM25').html(_.template($('.PM25Temp').html(), {
				data: data.data
			}));
		});
	}

	function getIconClass(weatherName) {
		var map = {
			sunny: 'wi-day-sunny',
			cloudy: 'wi-day-cloudy',
			rainy: 'wi-rain-mix'
		},
			iconClass = map[weatherName] || 'wi-day-sunny';
		return iconClass;
	};


})