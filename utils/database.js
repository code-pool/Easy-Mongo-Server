var Promise = require('bluebird'),
    db;

module.exports = { 
  list : List,
  setDb : SetDB,
  getDb : GetDB
};

function List() {
  return new Promise(function(resolve,reject){
    db.admin().listDatabases().then(function(data){
      resolve(data);
    });    
  });
}

function SetDB(database) {
  db = database;
}

function GetDB(){
  return db;
}