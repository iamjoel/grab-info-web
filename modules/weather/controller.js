var service = require('./service');
var moment = require('moment');
var cache = {
	weather: {},
	PM25: {}
};

function list(req, res) {
	var cityCode = req.params.cityName;
	var today = moment().format('YYYY-MM-DD');
	if (!cache.weather[today]) {
		service.getWeatherReport(cityCode, function(data) {
			cache.weather = {};
			cache.weather[today] = data;
			res.send(data);
		});
	} else {
		res.send(cache.weather[today]);
	}

};

function PM25(req, res) {
	var cityName = req.params.cityName;
	var today = moment().format('YYYY-MM-DD');
	if (!cache.PM25[today]) {
		service.getPM25(cityName, function(data) {
			cache.PM25 = {};
			cache.PM25[today] = data;
			res.send(data);
		})
	}else{
		res.send(cache.PM25[today]);
	}


}

module.exports = {
	list: list,
	PM25: PM25
};