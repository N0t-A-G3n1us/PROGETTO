

var express=require('express')
var app=express();

app.get('/', function (req, res) {
  res.send('Hello World');
})

console.log("c è un server in ascolto su localhost!"); 

app.listen(3000);