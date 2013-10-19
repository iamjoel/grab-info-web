var config = require('./config'),
    indexPage = require('./controllers/index');
   



module.exports = function(app){
    //
    app.get(config.userRoutes.index,indexPage.render);
 

    //404页面
    app.get('404',function(req,res){
        res.render('404')
    });
    app.get('*',function(req,res){
        res.render('404')
    });


};