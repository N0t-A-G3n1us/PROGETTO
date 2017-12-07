#!/usr/bin/env node

//This program will schedule tasks to our work queue
//E' il nuovo sender
//LANCIARE CON ./new_task.js 

var amqp=require('amqplib/callback_api');

//sempre apro connessione al server rabbitmq
amqp.connect('amqp://localhost',function(err,conn){
	//sempre creo il canale
	conn.createChannel(function(err,ch){
		var q = 'task_queue';
		//viene preso argv quando lanci il programma ex: Hello ...
		var msg = process.argv.slice(2).join(' ') || "Hello World!" ;

		ch.assertQueue(q,{durable: true});
		//durable: true -> rabbit cosi non perdera mai la coda
		
		ch.sendToQueue(q, new Buffer(msg), {persistent: true});
		// persistent: true -> mark our messages as persistent

		console.log(" [x] Sent '%s' ",msg );

	});

	setTimeout(function() { conn.close(); process.exit(0) }, 500);

});