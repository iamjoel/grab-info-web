var config = {
    port:8001,
    userRoutes:{    //用户显示页面
        index:'/'    
    },
    apiRoutes:{
    	weatherReport:'/api/weatherReport/:cityName'
    },
    adminRoutes:{ //管理页面    
    },
    showModules:['weatherReport'],//显示的module

  
};


module.exports = config;