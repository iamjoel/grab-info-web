define(function(require){
	require('lodash.min');
	require('/public/modules/weatherReport/main.css');
	var tpl = require('/public/modules/weatherReport/main.html#'),
		panelBody;
	panelBody = _.template(tpl);
	$('#weatherReport .panel-body').html(panelBody);

	var	todayWeatherTemp = require('/public/modules/weatherReport/todayWeather.html#'); 
	var cityName = 'suzhou',
		$todayWeatherCont = $('#todayWeather');
	$.ajax({
		url:'/api/weatherReport/'+ cityName,
		dateType:'json'
	}).done(function(data){
		if(data.code == 1){
			$todayWeatherCont.html(_.template(todayWeatherTemp,data.data.today));
		}else{

		}
	})


})