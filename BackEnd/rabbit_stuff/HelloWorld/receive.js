#!/usr/bin/env node

var amqp = require('amqplib/callback_api');


//apriamo la connessione e creiamo il canale
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    //dichiariamo la coda da cui consumeremo
    //va fatto anche qui perche vogliamo essere sicuri che ci sia 
    //e potrei far partire il consumer prima del publisher
    ch.assertQueue(q, {durable: false});
	console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

	//callback eseguita quando rabbitMQ pusha messaggi al consumer
	ch.consume(q, function(msg) {
  		console.log(" [x] Received %s", msg.content.toString());
	}, {noAck: true});
  
  });
});
