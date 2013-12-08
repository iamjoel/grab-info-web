var nodegrass = require('nodegrass');
var cheerio = require('cheerio');

// http://suzhou.xiaomishu.com/top/all.aspx 订餐小秘书
function getRestaurantRank(callback) {
	var url = 'http://suzhou.xiaomishu.com/top/all.aspx';
	nodegrass.get(url,function(data,status,headers){
		try{
			var $ = cheerio.load(data),
				rankData = proccessRankData($);
			callback && callback({
				code:'1',
				data: rankData
			});
		}catch(e){
			logger.error(__dirname + ':' + e);
			callback({
				code:'0',
				data:url + ': error' 
			});
		}
		

	}).on('error', function(e) {
	    logger.error(__dirname + ':' + e);
	});
	
}

function proccessRankData($){
	var $rankList = $('.res_ord_his tr'),
		rankData = [],
		LINK_PREFIX = 'http://suzhou.xiaomishu.com/';
	$rankList.each(function(index){
		var eachData = {},
			$this = $(this);
		if(index > 0){//第一行为表头
			eachData.index = index;
			eachData.name = $this.find('.g3').text();
			eachData.link = LINK_PREFIX + $this.find('.g3').attr('href');
			rankData.push(eachData);
		}
	});
	return rankData;

}



module.exports = {
	'getRestaurantRank':getRestaurantRank
}
