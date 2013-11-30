// 守护程序 在windows下用cli的forever和pm2均有些问题
var spawn = require('child_process').spawn,  
    server = null;  
  
function startServer(){  
    console.log('start server');  
    server = spawn('node',['app.js']);  
    console.log('node js pid is '+server.pid);  
    server.on('close',function(code,signal){  
        server.kill(signal);  
        server = startServer();  
    });  
    server.on('error',function(code,signal){  
        server.kill(signal);  
        server = startServer();  
    });  
    return server;  
};  
  
startServer(); 