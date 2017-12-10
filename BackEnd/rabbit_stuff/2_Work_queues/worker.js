#!/usr/bin/env node

//This program would be the new receiver and it will consume dot sec
//LANCIARE DUE ./worker.js (in due diversi terminali)

var amqp = require('amqplib/callback_api');

//sempre apro connessione al server rabbitmq
amqp.connect('amqp://localhost',function(err,conn){
	//sempre creo il canale
	conn.createChannel(function(err,ch){

		var q='task_queue';

		ch.prefetch(1);
		//This tells RabbitMQ not to give more than one message to a worker at a time
		//cioe lo passa al prossimo worker che ha gia inviato tutti gli acknowledgment 

		//RISCHIO: questo puo far crescere la coda se tutti i worker sono impegnati

		ch.assertQueue(q, {durable: true});
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

		ch.consume(q,function(msg){
			//parsa i dot (".") che indicano i secondi di sleep
			var secs = msg.content.toString().split('.').length - 1;

			console.log(" [x] Received %s", msg.content.toString());
			setTimeout(function(){

				console.log(" [x] Work Done");

			}, secs*1000);	//tempo di attesa

		}, {noAck:false} );

		//noAck:false -> Using this code we can be sure that even if you kill a worker using 
		//CTRL+C while it was processing a message, nothing will be lost. Soon after the worker 
		//dies all unacknowledged messages will be redelivered.


	});



});
