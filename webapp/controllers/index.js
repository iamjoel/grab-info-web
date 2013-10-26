var config = require('../config');
module.exports.render = function(req,res,next){
	var moduleNames = config.showModules,
		modules = [];
	moduleNames.forEach(function(each){
		modules.push(require('../modules/' + each + '/config'));
	});
	// console.log(modules);	
    res.render('index',{
    	modules:modules
    });
};