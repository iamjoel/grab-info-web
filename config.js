var config = {
    port:3000
    , basePath : __dirname 
    , logFilePath : __dirname + '/logs'
    , userRoutes : {    //用户显示页面
        index:'/'    
    }
    , session_secret: 'joel'
    , adminRoutes : { //管理页面    
    }
    , showModules : ['weather'
    	, 'constellation'
    	, 'restaurant'
    	// , 'movie'
    	]//显示的module
    // , apiVersion : '0.1'
  
};


module.exports = config;