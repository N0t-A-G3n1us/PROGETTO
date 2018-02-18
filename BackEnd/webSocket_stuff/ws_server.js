

var server = require('ws').Server;
const myPort=5001;
var s = new server({ port: myPort });

/////
/*	avviare il server da linea di comando, poi connettersi aprendo nel browser il file index.html (anche piu di uno)
*/
///
console.log("[S] server active on port: "+ myPort );

s.on('connection',function(ws){

	console.log("[S] connection established with one client ")

	ws.on('message',function(message){
		
		console.log("[S] Received from browser: " + message);
		setTimeout(function(){	
			if(message == "hello")
				ws.send("hi to you from server");
			else 
				ws.send(message+" [server sign]");
		},3000);

	})

	ws.on('close',function(){

		console.log("[S] connection with one client lost")
	})


});


var express= require('express');
var app = express();

app.get('/get',function(req,res){

	res.sendFile("/home/giuppo/Desktop/PROJ-X_RC/BackEnd/webSocket_stuff/index.html");
});

var server = app.listen(5000,function() {
  
  var host = server.address().address
  var port = server.address().port
 
  console.log("app in ascolto at http://%s:%s",host,port);
  
  })