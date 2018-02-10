var express=require('express');
var app=express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const port=3000;


// POST http://localhost:3000/api/users
// parameters sent with 
app.post('/api/users', function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;
    console.log("sending "+user_id+" "+token+" "+" "+geo )
    res.send(user_id + ' ' + token + ' ' + geo);
});

app.listen(port);
console.log('Server started! At http://localhost:' + port);