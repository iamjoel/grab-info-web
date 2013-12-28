var service = require('./service');
var moment = require('moment');
var cache = {};

function rank(req, res) {
    var today = moment().format('YYYY-MM-DD');
    if (!cache[today]) {
        service.getRestaurantRank(function(data) {
            cache = {}; //清空
            cache[today] = data;
            res.send(data);
        });
    } else {
        res.send(cache[today]);
    }

};

module.exports = {
    rank: rank
};