#!/usr/bin/env node

//PROGRAMMA PUBLISHER

var amqp=require('amqplib/callback_api');

//prima cosa sempre la connessione al server rabbit
amqp.connect('amqp://localhost',function(err,conn){
	//poi creo il canale di comunicazione ch
	conn.createChannel(function(err,ch){

		
		var ex='direct_logs'; //nome all' exchange

		//creiamo l exchange con nome ex, di tipo direct, non durable
		ch.assertExchange(ex,'direct',{durable:false});

		var msg = process.argv.slice(2).join(' ') || 'Hello World'
		console.log(msg)
		var severity;
		if(msg=="Hello World")
			severity='info';
		else if (msg.split(' ')[0]== "error"){
			severity='error';
			msg=msg.split(' ')[1];
		}
		else 
			severity='warning';

		//pronti a pubblicare un msg
		ch.publish(ex,severity,new Buffer(msg));
 		console.log(" [x] Sent %s: '%s'", severity, msg);


	});

	setTimeout(function () {

		conn.close();
		process.exit(0);
	}, 500);

});