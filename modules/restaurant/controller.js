var service = require('./service');
function rank(req,res){
	service.getRestaurantRank(function(data){
		res.send(data);
	});
};

module.exports = {
	rank:rank
};