#!/usr/bin/env node

var amqp=require('amqplib/callback_api');



//connect to rabbitmq server
amqp.connect('amqp://localhost', function(err, conn) {

	//crea un canale dove risidono la maggior parte delle funz. API
 	conn.createChannel(function(err, ch) {


 	var q = 'hello';

 	//Dibbiamo definire la coda a cui inviare 
    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer('Hello World!'));
    console.log(" [x] Sent 'Hello World!'");
  });

 	setTimeout(function() { conn.close(); process.exit(0) }, 500);


});


//close the connection and exit




