var service = require('./service');
function list(req,res){
	var cityCode = req.params.cityName;
	service.getWeatherReport(cityCode,function(data){
		res.send(data);
	});
};

module.exports = {
	list:list
};