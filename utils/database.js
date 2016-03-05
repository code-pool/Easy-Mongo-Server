var Promise = require('bluebird'),
    db;

module.exports = { 
  list : List,
  setDb : SetDB,
  getDb : GetDB
};

function List() {

  var databases = [],
      formatted = [],
      len = [],
      currObj = {};

  return new Promise(function(resolve,reject){
    db.admin().listDatabases().then(function(data){
      databases = data.databases || [];
      len = databases.length;
      while(len--) {
        currObj = {'db_name' : databases[len].name,'stats' : {}};
        formatted.push(currObj);
        currObj = {};
      }
      formatted.splice(formatted.indexOf('admin'),1);
      formatted.splice(formatted.indexOf('test'),1);
      resolve(formatted);
    });    
  });
}

function SetDB(database) {
  db = database;
}

function GetDB(){
  return db;
}