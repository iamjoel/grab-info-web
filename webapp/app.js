
var express = require("express"),
    app = express(),
    partials = require('express-partials'),
    routes = require('./routes'),
    config = require('./config');


app.configure(function(){
//由于Session需要加密session_id，所以一定要传入一个密钥字符串（任意）来加密
    // app.use(express.cookieParser('123'));
    // app.use(express.session());
//    app.use(express.cookieSession());
    app.use(partials());          //使用  partials，为了使用 layout express 3.X不支持 ejs的layout
    app.set('views', __dirname + '/views'); //设置模板路径，比如index.jade
    app.engine('.html', require('ejs').__express);
    app.set('view engine', 'html');  //配置模板解析引擎

    app.use(express.bodyParser());
    app.use(express.methodOverride()); //伪装PUT,DELETE请求


    //全局错误处理，不让服务器停掉
    app.use(function(err, req, res, next){
        console.error(err.stack);
        res.send(500, 'Something broke!');
    });


});


// 定义开发环境
app.configure('development', function(){
    //静态服务器
    app.use("/public", express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// 定义生产环境
app.configure('production', function(){
    var oneYear = 31557600000;
    app.use("/public", express.static(__dirname + '/public',{ maxAge: oneYear }));
    app.use(express.errorHandler());
});

routes(app);
app.listen(config.port);
console.log("server start listen " + config.port);


