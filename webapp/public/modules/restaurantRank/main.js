define(function(require){
  	var config = require('script/config');
	var tpl = require('restaurantRank/main.html#');
	$('#restaurantRank .panel-body').html(tpl);

	var $root = $('#restaurantRank');
	var restaurantRankData;

	getRestaurantRankData(function(){
		renderRestaurantRankData(restaurantRankData);
	});

	$('.refreshBtn',$root).click(function(){
		getRestaurantRankData(function(){
			renderRestaurantRankData(restaurantRankData);
		});
	});

	function getRestaurantRankData(callback){
		$.ajax({
			url: config.URL.restaurant
			,dateType:'json'
		}).done(function(data){
			if(data.code == 1){
				restaurantRankData = data.data;
			}else{
				restaurantRankData = false;
			}

			if(callback && _.isFunction(callback)){
				callback();
				$('.scrollWrap',$root).perfectScrollbar({wheelPropagation: false});
			}
		}).always(function(){
			$('.panel-body', $root).unblock();
		});
	};

	function renderRestaurantRankData(data){
		var	itemTemp = require('restaurantRank/item.html#');
		var	$contWrap = $('.panel-body tbody',$root);
		if(data){
			data.forEach(function(each){
				$contWrap.append(_.template(itemTemp,each));
			});
		}else{
			$('.panel-body', $root).html('服务器端错误，请刷新页面重试！');
		}

	};
	

})