#!/usr/bin/env node

const amqp=require('amqplib/callback_api');

const welcome_msg="Welcome to myServer";
const help_msg="Command available: \n hello \n help "
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyCyG7OqzcCze6H0mkfYxf_2tUjYmu4wxpE', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};



amqp.connect('amqp://localhost',function(err,conn){

	conn.createChannel(function(err,ch){

		console.log(welcome_msg)
		var q= 'myServer_queue';

		ch.assertQueue(q,{durable:false});

		ch.prefetch(1);

		console.log('[x] my server is awaiting for messages' )

		ch.consume(q, function reply(msg) {

			var geocoder = NodeGeocoder(options);
			console.log(" [.] elaborating (%s)", msg.content.toString());
			geocoder.geocode(msg.content.toString(), function(err, res) {
  				//console.log(res);
			

  			console.log(JSON.stringify(res));
      		//var ris = generateRes(msg.content.toString());	
      	  
		    ch.sendToQueue(msg.properties.replyTo,new Buffer(JSON.stringify(res)),{correlationId: msg.properties.correlationId});

		    ch.ack(msg);
	      
	      	console.log('[x]  my server is awaiting for messages');
	      	});
    });




	});

});


function welcome(){
	console.log(welcome_msg);
}

function generateRes(msg){

	switch(msg){
		case "hello":
			console.log("cmd recognized")
			return welcome_msg;
		case "help":
			return help_msg;
			
		default:
			return "did not understand";
	}

}

