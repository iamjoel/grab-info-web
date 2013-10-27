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
		var min = minAndMaxReg.exec(data['temp'+ i])[1],
			max = minAndMaxReg.exec(data['temp'+ i])[2];
		if(min > max){
			var temp = min;
			min = max;
			max = temp; 
		}
		weatherTrendData.push({
			tempMin:min,
			tempMax:max,
			weather : data['weather'+ i],
			weatherEn : getWeatherEnName(data['weather'+ i])
		});
	}
	todayWeatherData.tempMin = weatherTrendData[0].tempMin;
	todayWeatherData.tempMax = weatherTrendData[0].tempMax;
	todayWeatherData.weather = weatherTrendData[0].weather;
	todayWeatherData.weatherEn = weatherTrendData[0].weatherEn;
	
	todayWeatherData.wind = data.wind1;
	todayWeatherData.sugg = data.index_d;//建议

	return {
		today : todayWeatherData,
		trend : weatherTrendData
	}	
}

function getWeatherEnName(cnName){
	var enName = 'sunny';
	if(cnName == "晴" || cnName.indexOf('晴') > 0){
		enName = 'sunny';
	}else if(cnName == "多云" || cnName == "阴" || cnName.indexOf('多云') > 0){
		enName = 'cloudy';
	}else{
		enName = 'rainy';
	}
	return enName;
}
getWeatherReport('suzhou');

module.exports = {
	'getWeatherReport':getWeatherReport
}
