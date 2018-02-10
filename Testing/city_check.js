const express=require('express')
const app=express()
const Maps = require('@google/maps')




const API_KEY="AIzaSyALEGO-uhhGfZ8p22NM5WVx0n1PgMrULss";
const maps=Maps.createClient({
  key: API_KEY
});
//Make requests to the Google Maps APIs by calling methods on the client object.


const port=3000;

app.get('/check/:cit',function(req,res){
  var citta=req.params.cit
  console.log("get citta: "+ citta)
  
  maps.geocode({
  address: citta
}, function(err, response) {
  if (!err) {
    ct=response.json.results
    console.log(ct);
    res.send(ct)
  }
  else {
    res.send('Geocode was not successful for the following reason: ' +
        err);
    }
  
  });
});
  


app.listen(port);
console.log("server started at http://localhost:"+port)
    
