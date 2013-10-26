var config = {
	id:'weatherReport',
    name:'天气预报',
    width:'col-md-7',
    api : [{
    	name:'weatherReport',
    	path:'/api/weatherReport/:cityName'
    }]
};


module.exports = config;