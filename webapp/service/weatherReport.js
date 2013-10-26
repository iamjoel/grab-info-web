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
			try{
				var data = JSON.parse(data),
				weatherData = proccessWeatherData(data.weatherinfo);
				callback && callback({
					code:'1',
					data: weatherData
				});
			}catch(e){
				console.error(e);
				callback({
					code:'0',
					data:url + ': error' 
				});
			}
			
		});
	}
	
	
}

function proccessWeatherData(data){
	var todayWeatherData = {},
		weatherTrendData = [],
		minAndMaxReg = /(\d+)℃~(\d+)℃/;
	for(var i = 1,len = 6; i <= len; i++){
		weatherTrendData.push({
			tempMin:minAndMaxReg.exec(data['temp'+ i])[2],
			tempMax:minAndMaxReg.exec(data['temp'+ i])[1],
			weather : data['weather'+ i]
		});
	}
	todayWeatherData.tempMin = weatherTrendData[0].tempMin;
	todayWeatherData.tempMax = weatherTrendData[0].tempMax;
	todayWeatherData.weather = weatherTrendData[0].weather;
	if(todayWeatherData.weather == "晴" || todayWeatherData.weather == "多云转晴"){
		todayWeatherData.icon = 'sunny';
	}else if(todayWeatherData.weather == "多云" || todayWeatherData.weather == "阴" || todayWeatherData.weather.indexOf('阴') > 0){
		todayWeatherData.icon = 'cloudy';
	}else{
		todayWeatherData.icon = 'runny';
	}
	todayWeatherData.wind = data.wind1;
	todayWeatherData.sugg = data.index_d;//建议

	return {
		today : todayWeatherData,
		trend : weatherTrendData
	}	
}
getWeatherReport('suzhou');

module.exports = getWeatherReport

