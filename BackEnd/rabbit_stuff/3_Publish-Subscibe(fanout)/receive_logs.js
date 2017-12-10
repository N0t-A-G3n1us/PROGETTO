#!/usr/bin/env node

//PROGRAMMA SUBSCRIBER (consumer)
// lanciarne due in due diversi terminal

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost',function(err,conn){

	conn.createChannel(function(err,ch){

		var ex="logs";
		ch.assertExchange(ex, 'fanout',{durable:false});

		ch.assertQueue('', {exclusive: true},function(err,q){
			console.log(" [*] Waiting for messages in %s. CTRL+C to exit",
				q.queue);
			ch.bindQueue(q.queue, ex, '');	// viene fatto il binding coda-exchange

			ch.consume(q.queue, function(msg){

				console.log(" [x] %s",msg.content.toString());

			}, {noAck: true});

		})

	});


});