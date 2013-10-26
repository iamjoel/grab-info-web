var config = require('./config'),
    indexPage = require('./controllers/index'),
    showModules = config.showModules,
    modulePath = './modules',
    _ = require('lodash');
   

module.exports = function(app){
    app.get(config.userRoutes.index,indexPage.render);
    //modules api 异步接口
    showModules.forEach(function(moduleName){
        var eachModuleConfig = require([modulePath,moduleName,'config'].join('/'));
        if(eachModuleConfig.api && _.isArray(eachModuleConfig.api)){
            eachModuleConfig.api.forEach(function(api){
                app.get(api.path,require([modulePath,moduleName,'controller'].join('/'))[api.name])
            })
        }
    })
 

    //404页面
    app.get('404',function(req,res){
        res.render('404')
    });
    app.get('*',function(req,res){
        res.render('404')
    });


};