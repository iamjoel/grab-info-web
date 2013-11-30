# 格子
格子是提供日常信息的web项目和桌面项目。每种信息都显示在一个格子中。类似igoogle。     

web项目的后端使用nodejs，以及web框架express。当显示的信息需要第三方来提供时，优先使用jsonp接口，否则用node来调用端口。前端使用bootstrap3来控制网站风格以及响应式；使用[seajs](http://seajs.org/docs/)
来加载资源；用jquery来进行基本的DOM操作，用backbonejs来管理逻辑，用[lo-dash](http://lodash.com/)来拓展js的帮助方法；以及其他一些jquery的组件。  

桌面项目准备使用[node-webkit](https://github.com/rogerwang/node-webkit)，用[nodebob](https://github.com/geo8bit/nodebob)来构建。

## 启动web项目
* 安装[nodejs](http://nodejs.org/)
* 下载本项目
* 安装依赖并运行 
 * cd webapp 
 * npm start
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
* [javascript书写规范](https://github.com/iamjoel/grabInfo/wiki/javascript-style)
* [css 命名规范](https://github.com/iamjoel/grabInfo/wiki/css-classname-guide)

## 提交bug 
点 [这里](https://github.com/iamjoel/grabInfo/issues/new)







