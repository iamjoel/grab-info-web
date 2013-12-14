var service = require('./service');
function list(req,res){
	var cityCode = req.params.cityName;
	service.getWeatherReport(cityCode,function(data){
		res.send(data);
	});
};

function PM25(req, res) {
	var cityName = req.params.cityName;
	service.getPM25(cityName,function(data){
		res.send(data);
	})
}

module.exports = {
	list:list
	, PM25 : PM25
};