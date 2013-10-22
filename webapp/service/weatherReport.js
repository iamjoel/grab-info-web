var nodegrass = require('nodegrass');
//用中央气象台提供的api,接口参考 http://g.kehou.com/t1029846752.html
var cityNameCodeMapping = {
	'suzhou':'101190401'
}
// cityName 是拼音
function getWeatherReport(cityName,callback) {
	var cityCode = cityNameCodeMapping[cityName],
		url;
	if(cityCode == undefined){
		callback({
			code:'0',
			data:'sorry '+ cityName + ' is not support now!'
		});
	}else{
		url = 'http://m.weather.com.cn/data/'+ cityCode +'.html';
		nodegrass.get(url,function(data,status,headers){
			var data = JSON.parse(data),
				weatherData = proccessWeatherData(data.weatherinfo);;
			
			// console.log(weatherData);
			callback && callback({
				code:'1',
				data: weatherData
			});
		});
	}
	
	
}

function proccessWeatherData(data){
	var todayWeatherData = {},
		weatherTrendData = [],
		minAndMaxReg = /(\d+)℃~(\d+)℃/;
	for(var i = 1,len = 6; i <= len; i++){
		weatherTrendData.push({
			tempMin:minAndMaxReg.exec(data['temp'+ i])[1],
			tempMax:minAndMaxReg.exec(data['temp'+ i])[2],
			weather : data['weather'+ i]
		});
	}
	todayWeatherData.tempMin = weatherTrendData[0].tempMin;
	todayWeatherData.tempMax = weatherTrendData[0].tempMax;
	todayWeatherData.weather = weatherTrendData[0].weather;
	todayWeatherData.wind = data.wind1;

	return {
		today : todayWeatherData,
		trend : weatherTrendData
	}	
}
getWeatherReport('suzhou');

module.exports = getWeatherReport
