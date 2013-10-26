var service = require('./service');
function weatherReport(req,res){
	var cityCode = req.params.cityName;
	service.getWeatherReport(cityCode,function(data){
		res.send(data);
	});
};

module.exports = {
	weatherReport:weatherReport
};