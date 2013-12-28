var constant = require('../constant');
var SUCCESS_CODE = constant.SUCCESS_CODE;
var ERROR_CODE = constant.ERROR_CODE;
var user = require('../models/user');
module.exports.list = function(req, res) {
	var userId = 0;
    if (req.session.userId != null) {
        userId = req.session.userId;
    }
	try {
		res.send({
			success : SUCCESS_CODE
			, data : user.getModules(userId)
		});	
	} catch (err){
		res.send({
			success : ERROR_CODE
			, message : err
		});
	}
	
	
}