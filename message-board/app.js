const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring')

//创建假数据
var msge = [
	{name: '张三',content: '你好我是张三',creat_at:'2017-10-10 10:10:10'},
	{name: '李四',content: '你好我是李四',creat_at:'2017-11-10 10:10:10'},
	{name: '王五',content: '你好我是王五',creat_at:'2017-12-10 10:10:10'}
];

var server = http.createServer();

server.on('request',function(req,res){
	//获取当前地址
	var currentUrl = req.url;
	//请求'/'加载留言板列表
	if (currentUrl == '/') {
		fs.readFile('./view/index.html','utf8',function(err,data){
			if (err) {
				res.end('404 Not Found')
			}
			else{
				var html = '';
				msge.forEach(function(item){
					html += `<li class="text-left">
								${item.name}说：${item.content}
								<span class="text-right">${item.creat_at}</span>
							</li>`

				});
				

				var data = data.replace('*',html);
				//响应数据的编码设置
				res.setHeader('Content-Type','text/html;charser=utf-8');
				res.write(data);
				res.end()

			}

		})

	}
	//请求'add'加载留言板添加
	else if (currentUrl == '/add') {
		fs.readFile('./view/add.html','utf8',function(err,data){
			if (err) {
				res.end('404 Not Found')
			}
			else{
				//响应数据的编码设置
				res.setHeader('Content-Type','text/html;charser=utf-8');
				res.write(data);
				res.end()

			}

		})

	}
	//检测静态资源并反应
	else if (currentUrl.indexOf('/public') === 0) {
		fs.readFile('./' + currentUrl,'utf8',function(err,data){
			if (err) {
				res.end('404 Not Found')
			}
			else{
				//响应数据的编码设置,静态资源不需要设置
				//res.setHeader('Content-Type','text/html;charser=utf-8');
				res.write(data);
				res.end()

			}

		})

	}
	else if (currentUrl.indexOf('/doadd') === 0) {
		//表单提交数据处理
		if (req.method == 'POST') {
			//明确：表单post提交的数据可能会非常大，所以要分片获取
			//说明:data事件-事件传输中，end事件-数据传输完毕
			var postDate = '';
			req.on('data',function(chunk){
				postDate += chunk;
			});
			req.on('end',function(){
				//通过字符串quertstring模块将字符串数据转化为对象
				paramObj = querystring.parse(postDate);
				console.log(paramObj);
				//入库
				var d = new Date();
				var date = d.getFullYear()+'-'+(parseInt(d.getMonth())+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
				var msg = {name: paramObj.name, content: paramObj.content, creat_at: date};
				msge.push(msg);
				//跳转
				res.statusCode = 302;
				res.setHeader('location','/');
				res.end()
			})

		}
		else{
			//接受数据
			var paramObj = url.parse(req.url,true).query;
			console.log(paramObj);

			//入库
			var d = new Date();
			var date = d.getFullYear()+'-'+(parseInt(d.getMonth())+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
			var msg = {name: paramObj.name, content: paramObj.content, creat_at: date};
			msge.push(msg);
			//跳转
			res.statusCode = 302;
			res.setHeader('location','/');
			res.end()
		}

	}
	//否则404
	else{
		fs.readFile('./view/404.html','utf8',function(err,data){
			if (err) {
				res.end('404 Not Found')
			}
			else{
				//响应数据的编码设置
				res.setHeader('Content-Type','text/html;charser=utf-8');
				res.write(data);
				res.end()

			}

		})

	}

})

server.listen(8080,function(){
	console.log('启动成功，访问：http://localhost:8080')
})