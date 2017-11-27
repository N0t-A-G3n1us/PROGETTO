

var express=require('express');
var app=express();

var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

console.log("dovrei essere un server");

app.post("/getInfo", function (req,res) {
	
  //	res.send("SEI IN GETINFO");
	console.log("ANANNANA")
  res.send('You sent me ' + req.body.citta);
		})
	

var server = app.listen(3000,function() {
	
	var host = server.address().address
	var port = server.address().port
	
	console.log("app in ascolto at http://%s:%s",host,port);
	
	})
