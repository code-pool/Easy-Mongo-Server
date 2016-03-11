var Promise = require('bluebird'),
    MongoClient = require('mongodb').MongoClient,
    dbServer = 'mongodb://localhost:27017/',
    archiver = require('archiver'),
    fs = require('fs'),
    dbUtils = require('utils/database.js');

module.exports = {
  list : List,
  verified : Verified
};

setTimeout(function(){
  dbUtils = require('utils/database.js');
},1000);


function List(database){

  return new Promise(function(resolve,reject){
    
    var db = dbUtils.getDb(database);
    db.collections(function(err,collections){
      
      if(err){
        resolve(err);
        return;
      }

      resolve(collections);
    });

  });
}

function Verified(database,collection){

  var ignoreCols = ['system.indexes','__schema'];

  return new Promise(function(resolve,reject){

    // do not search for schema validation for default collections
    if(ignoreCols.indexOf(collection) >= 0) {
      resolve(true);
      true;
    }

    var db = dbUtils.getDb(database);
    db.collection('__schema').findOne({'collection' : collection},function(err,result){
      if(err){
        reject(err);
        return;
      }
      if(!result) {
        resolve(false);
        return;
      }
      resolve(true);
    })
  });
}