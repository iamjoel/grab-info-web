var constant = require('../constant');
var SUCCESS_CODE = constant.SUCCESS_CODE;
var ERROR_CODE = constant.ERROR_CODE;
module.exports.list = function(req, res) {
	// 以后从cookie中取
	var modules = require('../config').showModules;
	var data = [];
	try {
		modules.forEach(function(each) {
			var module = require('../modules/' + each + '/config');
			data.push(module); 
		});
		res.send({
			success : SUCCESS_CODE
			, data : data
		});	
	} catch (err){
		res.send({
			success : ERROR_CODE
			, message : err
		});
	}
	
	
}