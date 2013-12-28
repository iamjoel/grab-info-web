var config = require('../config');
var user = require('../models/user');
module.exports.render = function(req, res, next) {
    var userId = 0;
    if (req.session.userId != null) {
        userId = req.session.userId;
    }
   	
    res.render('index', {
        modules: user.getModules(userId)
    });
};