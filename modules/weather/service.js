var nodegrass = require('nodegrass');
var util = require('../../util');
var logger = util.logger;
var config = require('../../config');
//用中央气象台提供的api,接口参考 http://g.kehou.com/t1029846752.html
var cityNameCodeMapping = {
	'suzhou': '101190401'
}
// cityName 是拼音
	function getWeatherReport(cityName, callback) {
		var cityCode = cityNameCodeMapping[cityName],
			url;
		if (cityCode == undefined) {
			callback({
				code: '0',
				data: 'sorry ' + cityName + ' is not support now!'
			});
		} else {
			url = 'http://m.weather.com.cn/data/' + cityCode + '.html';
			nodegrass.get(url, function(data, status, headers) {
				try {
					var data = JSON.parse(data),
						weatherData = proccessWeatherData(data.weatherinfo);
					callback && callback({
						code: '1',
						data: weatherData
					});
				} catch (e) {
					logger.error(__dirname + ':' + e);
					callback && callback({
						code: '0',
						data: url + ': error'
					});
				}

			}).on('error', function(e) {
				logger.error(__dirname + ':' + e);
			});
		}


	}

	function proccessWeatherData(data) {
		var todayWeatherData = {},
			weatherTrendData = [],
			minAndMaxReg = /(-?\d+)℃~(-?\d+)℃/;

		for (var i = 1, len = 6; i <= len; i++) {
			var min = Number(minAndMaxReg.exec(data['temp' + i])[1]);
			var max = Number(minAndMaxReg.exec(data['temp' + i])[2]);
			if (min > max) {
				var temp = min;
				min = max;
				max = temp;
			}
			weatherTrendData.push({
				tempMin: min,
				tempMax: max,
				weather: data['weather' + i],
				weatherEn: getWeatherEnName(data['weather' + i])
			});
		}
		todayWeatherData.tempMin = weatherTrendData[0].tempMin;
		todayWeatherData.tempMax = weatherTrendData[0].tempMax;
		todayWeatherData.weather = weatherTrendData[0].weather;
		todayWeatherData.weatherEn = weatherTrendData[0].weatherEn;

		todayWeatherData.wind = data.wind1;
		todayWeatherData.sugg = data.index_d; //建议

		return {
			today: todayWeatherData,
			trend: weatherTrendData
		}
	}

	function getWeatherEnName(cnName) {
		var enName = 'sunny';
		if (cnName == "晴" || cnName.indexOf('晴') > 0) {
			enName = 'sunny';
		} else if (cnName == "多云" || cnName == "阴" || cnName.indexOf('多云') > 0) {
			enName = 'cloudy';
		} else {
			enName = 'rainy';
		}
		return enName;
	}
var airPollutionKey = require(config.basePath + '/appKey').airPolloution;

function getPM25(cityName, callback) {
	cityName = cityName || 'suzhou';
	var url = 'http://www.pm25.in/api/querys/pm2_5.json?city=suzhou&token=' + airPollutionKey;
	nodegrass.get(url, function(data, status, headers) {
		try {
			data = JSON.parse(data);
			data.forEach(function(each) {
				each.quality = normalStr(each.quality);
				each.pm2_5 = normalStr(each.pm2_5);
				each.pm2_5_24h = normalStr(each.pm2_5_24h);

			})
			callback && callback({
				code: '1',
				data: data
			});
		} catch (e) {
			logger.error(__dirname + ':' + e);
			callback({
				code: '0',
				data: url + ': error'
			});
		}
	}).on('error', function(e) {
		logger.error(__dirname + ':' + e);
	});
}

function normalStr(str) {
	if (str == null || str == 0) {
		return '未知';
	} else {
		return str;
	}
}

module.exports = {
	'getWeatherReport': getWeatherReport,
	'getPM25': getPM25
}