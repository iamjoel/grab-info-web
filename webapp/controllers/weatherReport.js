var service = require('../service/weatherReport');
function weatherReport(req,res){
	var cityCode = req.params.cityName;
	service(cityCode,function(data){
		res.send(data);
	});
};

module.exports = {
	api:weatherReport
};