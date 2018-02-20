#!/usr/bin/env node


//per ricevere tutti i log:
//$   ./receive_logs_topic.js "#"

//per ricecere solo log da "INFO-FLICKR" o "INFO-WIKI" o...:
//$   ./receive_logs_topic.js "kern.*"


var amqp = require('amqplib/callback_api');

var fs = require('fs');

var timestamp = require('console-timestamp'); 

var now = new Date();

var args = process.argv.slice(2);


if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'log_ex';

    fs.appendFile(__dirname+'/logTest.txt',"\n\n\n\n");


    ch.assertExchange(ex, 'topic', {durable: false});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      args.forEach(function(key) {
        ch.bindQueue(q.queue, ex, key);
      });

      ch.consume(q.queue, function(msg) {
        fs.appendFile(__dirname+'/logTest.txt',
          timestamp('[SERVER TIME hh:mm]') + " ["+msg.fields.routingKey+"] " + msg.content.toString()+'\n', function(err) {
            if(err) {
              return console.log(err);
            }
            console.log("[F] writing on file");

        });

        
  
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
      }, {noAck: true});
    

  });

  });

});