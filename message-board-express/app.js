//创建假数据
var msge = [
	{name: '张三',content: '你好我是张三',creat_at:'2017-10-10 10:10:10'},
	{name: '李四',content: '你好我是李四',creat_at:'2017-11-10 10:10:10'},
	{name: '王五',content: '你好我是王五',creat_at:'2017-12-10 10:10:10'}
];
//引入express框架
const express = require('express');
const url = require('url');
const moment = require('moment');

//创建app对象
var app = express();

//配置模板引擎
app.engine('html', require('express-art-template'))
//允许指定目录被外部访问
app.use('/public', express.static('public'));
//路由
//#留言列表
app.get('/', function(req, res){
	res.render('index.html',{
		msge: msge
	})

})
//#留言添加
app.get('/add', function(req, res){
	res.render('add.html')

})
//#留言添加处理
app.get('/doadd', function(req, res){
	//res.render('view/index.html')
	//接收参数
	var paramObj = url.parse(req.url,true).query;
	//入库
	var date = moment().format("YYYY-MM-D h:mm:ss");
	var msg = {name:paramObj.name, content:paramObj.content, creat_at:date};
	msge.push(msg);
	//跳转
	res.redirect('/');

})


//启动
app.listen(8080,function(){
	console.log('启动成功，访问：http://localhost')
})