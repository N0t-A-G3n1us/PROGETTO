var server = require('ws').Server;
const myPort=5001;
var s = new server({ port: myPort });

console.log("[S] server active on port: "+ myPort );

s.on('connection',function(ws){

	console.log("[S] connection established with one client ")

	ws.on('message',function(message){
		
		console.log("[S] Received from browser: " + message);
		
		if(message == "hello")
			ws.send("hi to you from server");
		else 
			ws.send(message+" [server sign]");
		
	})

	ws.on('close',function(){

		console.log("[S] connection with one client lost")
	})


});