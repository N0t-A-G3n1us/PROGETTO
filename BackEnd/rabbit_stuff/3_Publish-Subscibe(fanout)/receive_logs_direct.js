#!/usr/bin/env node

//PROGRAMMA SUBSCRIBER

var amqp=require('amqplib/callback_api');

//prima cosa sempre la connessione al server rabbit
amqp.connect('amqp://localhost',function(err,conn){
	//poi creo il canale di comunicazione ch
	conn.createChannel(function(err,ch){

		var ex='direct_logs';

		var args=process.argv.slice(2);

		if (args.length == 0) {
			console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  			process.exit(1);
		}


		ch.assertExchange(ex,'direct',{durable:false});

		ch.assertQueue('',{exclusive:true},function(err,q){

			console.log("[*] Waiting messages in %s",q.queue);

			//fin qui come semplice emit_logs.js
			//ma adesso è necessario un binding per severity

			args.forEach ( function(severity){
				ch.bindQueue(q.queue,ex,severity);
			});

			ch.consume(q.queue, function(msg){

				console.log(" [x] %s",msg.content.toString());

			}, {noAck:true});


		});

	});


});