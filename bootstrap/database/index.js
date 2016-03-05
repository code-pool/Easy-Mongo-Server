var MongoClient = require('mongodb').MongoClient,
    dbUtils = require('utils/database');
 
// Connection URL 
var url = 'mongodb://localhost:27017/test';

function Initialize(){
  MongoClient.connect(url, function(err, connected) {

    console.log("Connected to the databse");
    dbUtils.setDb(connected);
    
  });
}

Initialize();