#!/usr/bin/env node

const amqp=require('amqplib/callback_api');
const readline = require('readline');


amqp.connect('amqp://localhost',function(err,conn){

	conn.createChannel(function(err,ch){

		console.log("Welcome Client, connection established, channel created")

		const rl = readline.createInterface({
 		 	 input: process.stdin,
 			 output: process.stdout
		});

		ch.assertQueue('',{exclusive:true}, function (err,q){
			var corID=generateID();

			ch.consume(q.queue,function(msg_received){

				if (msg_received.properties.correlationId == corID) {
          			console.log('[<-] Server response:\n %s\n', msg_received.content.toString());
          			//setTimeout(function() { conn.close(); process.exit(0) }, 500);
        		}
      		}, {noAck: true});

			console.log('Write messages (CTRL + C to terminate)')

			rl.on('line', (msg) => {	// evento line emesso quando  input stream riceve end-of-line input (\n, \r, or \r\n)
				// TODO: Log the answer in a database
				console.log('[--] Trying to send : %s',msg);	
		
				ch.sendToQueue('myServer_queue',new Buffer(msg.toString()),{ correlationId: corID, replyTo: q.queue });
		
				console.log('[->] msg sent to queue')
			});

			rl.on('SIGINT', () => {
				console.log("CLIENT EXITED [CAUSE SIGINT]")
				rl.close();
				process.exit(0);		
			});

		});

	});


});



function generateID() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}






