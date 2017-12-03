

var express=require('express');
var request=require('request');
var app=express();

var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

//var url1="https://en.wikipedia.org/w/api.php?action=query&titles=";

var citta="Milan";
//var url2="&prop=revisions&rvprop=content&format=json";

//var url=url1+citta+url2
var stackUrl="https://en.wikipedia.org/w/api.php?format=json&"+
+"action=query&prop=extracts&exintro=&explaintext=&titles="+citta;




	
function callback(error,res,body){
	var info=JSON.parse(body);
	let page = info.query.pages;
//	let pageId = Object.keys(info.query.pages)[0];
	//let content = pageId.extract;
	//console.log(content);
}


	
request.get(stackUrl,callback)


var server = app.listen(3000,function() {
	
	var host = server.address().address
	var port = server.address().port
	
	console.log("app in ascolto at http://%s:%s",host,port);
	
	})
