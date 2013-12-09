# 格子 [![依赖模块状态](https://david-dm.org/iamjoel/grabInfo-web.png)](http://david-dm.org/iamjoel/grabInfo-web)
格子是提供日常信息的web项目。每种信息都显示在一个格子中。类似igoogle。     

项目的后端使用nodejs，以及web框架express。前端使用bootstrap3来控制网站风格以及响应式；使用[seajs](http://seajs.org/docs/)
来加载资源；用jquery来进行基本的DOM操作，用backbonejs来管理逻辑，用[lo-dash](http://lodash.com/)来拓展js的帮助方法；以及其他一些jquery的组件。  


## 启动项目
* 安装[nodejs](http://nodejs.org/)
* 下载本项目
* 安装依赖并运行 
 * cd 项目根目录 
 * npm start。如果要让其能在发生意外时，仍能持续运行，可使用 npm install。然后 forever start app.js。
 * 在浏览器中访问 http://127.0.0.1:3000/



## 已完成的模块
* 天气预报web
功能：显示今天的天气，以及最近六天的天气趋势。
*  星座
功能：显示对各个星座的建议。
*  苏州餐厅排名
功能：显示苏州本月热门餐厅排行榜。


效果图:    
![概览](http://img.hb.aicdn.com/8b261f7a64a6a6a6b69870c3fe3ecc002f70a640283c6-0akA69_fw580)      
更多请点击 [这里](http://huaban.com/boards/13744965/)查看

## <a name="projectStyle">项目编码规范</a>
* [javascript书写规范](https://github.com/iamjoel/grabInfo-web/wiki/javascript-style)
* [css 命名规范](https://github.com/iamjoel/grabInfo-web/wiki/css-classname-guide)

## 提交bug 
点 [这里](https://github.com/iamjoel/grabInfo-web/issues/new)







