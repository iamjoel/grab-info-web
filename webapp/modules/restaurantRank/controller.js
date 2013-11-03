var service = require('./service');
function getRestaurantRank(req,res){
	service.getRestaurantRank(function(data){
		res.send(data);
	});
};

module.exports = {
	restaurantRank:getRestaurantRank
};