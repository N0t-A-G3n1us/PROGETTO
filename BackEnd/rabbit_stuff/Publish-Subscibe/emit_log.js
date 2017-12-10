#!/usr/bin/env node


//PROGRAMMA PUBLISHER (producer)
//lanciarne uno e verificare che il messaggio arrivi a tutti i subscriber

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost',function(err,conn){

	conn.createChannel(function(err,ch){

		var ex='logs'; // nome dell exchange
		ch.assertExchange(ex,'fanout',{durable:false,exclusive:true});

		//non viene fatto alcun binding con la coda e questo è ok
		//se non c è alcun consumer in ascolto i msg saranno persi

		var msg= process.argv.slice(2).join(' ') || "Hello World" ;		

		ch.publish(ex,'',new Buffer(msg));

		console.log(" [x] Sent %s",msg);


	});

	setTimeout(function(){

		conn.close();
		process.exit(0);

	}, 500 );

});