define(function(require){
	var tpl = require('/public/modules/restaurantRank/main.html#');
	$('#restaurantRank .panel-body').html(tpl);

	var	itemTemp = require('/public/modules/restaurantRank/item.html#');
	var	$contWrap = $('#restaurantRank .panel-body tbody');
	$.ajax({
		url:'/api/getRestaurantRank/'
		,dateType:'json'
	}).done(function(data){
		if(data.code == 1){
			data.data.forEach(function(each){
				$contWrap.append(_.template(itemTemp,each));
			});
		}else{
			$('#restaurantRank .panel-body').html('服务器端错误，请刷新页面重试！');
		}
	}).always(function(){
		$('#restaurantRank .panel-body').unblock();
	});

})