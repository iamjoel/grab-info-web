define(function(require, exports) {
	exports.LOADING_CONFIG = {
	    message: '<img src="/public/images/loading.gif" />'
	    ,css:{
	    	background:'none',
	        border:'none'
	    }
    };

    exports.URL = {
      weather : '/api/weather/'
      ,constellation:'http://api.uihoo.com/astro/astro.http.php'
      ,restaurant: '/api/restaurant/suzhou?sort=-love'
	}; 
});