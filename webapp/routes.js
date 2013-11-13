var config = require('./config');
var indexPage = require('./controllers/index');
var _ = require('lodash');
   

module.exports = function(app){
    //网站首页
    app.get(config.userRoutes.index,indexPage.render);
    
    // RESTFul url  参考 www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api?utm_source=hackernewsletter&utm_medium=email
    var weatherController = require('./modules/weather/controller');
    app.get('/api/weather/:cityName',weatherController.list);

    var restaurantController = require('./modules/restaurant/controller');
    app.get('/api/restaurant/:cityName',restaurantController.rank);//喜爱程度从高到低
 

    //404页面
    app.get('404',function(req,res){
        res.render('404')
    });
    app.get('*',function(req,res){
        res.render('404')
    });


};