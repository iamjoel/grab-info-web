define(function(require){
	require('lodash.min');
	var tpl = require('/public/modules/weatherReport/main.html#'),
		panelBody;
	panelBody = _.template(tpl,{cityName:'苏州'});
	$('#weatherReport .panel-body').html(panelBody);

})