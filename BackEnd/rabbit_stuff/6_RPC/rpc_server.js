#!/usr/bin/env node

//single callback queue per client

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'rpc_queue'; //nome coda

    ch.assertQueue(q, {durable: false}); //crea coda client->[rpc_queue]->server
    
    ch.prefetch(1);// This tells RabbitMQ not to give more than one message to a worker at a time
		//cioè lo passa al prossimo worker che ha gia inviato tutti gli acknowledgment 

    
    console.log(' [x] Awaiting RPC requests');
    ch.consume(q, function reply(msg) {
      var n = parseInt(msg.content.toString());

      console.log(" [.] fib(%d)", n);

      var r = fibonacci(n);

      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(r.toString()),
        {correlationId: msg.properties.correlationId});

      ch.ack(msg);
      console.log(' [x] Awaiting RPC requests');
    });
  });
});

function fibonacci(n) {	//algoritmo O(2^n)
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}