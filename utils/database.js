var Promise = require('bluebird'),
    MongoClient = require('mongodb').MongoClient,
    dbServer = 'mongodb://localhost:27017/',
    db = {};

module.exports = { 
  list : List,
  setDb : SetDB,
  getDb : GetDB,
  connectAll : ConnectAll,
  connect : Connect,
  dbInfo : DbInfo
};

function List() {

  var databases = [],
      formatted = [],
      len = [],
      currObj = {};

  return new Promise(function(resolve,reject){
    db['test'].admin().listDatabases().then(function(data){
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

function ConnectAll() {
  
  var len,
      currdbName;

  List()
  .then(function(databases){
    len = databases.length;
    
    while(len--) {
      currdbName = databases[len].db_name;
      if(db[currdbName]) {
        continue;
      }
      Connect(currdbName);
    }
  })
  .catch(function(err){
    console.log('Error connecting multi database')
    console.log(err)
  });

}


function Connect(db_name){

  var url = dbServer + db_name;
  MongoClient.connect(url, function(err, connected) {
    console.log("Connected to the database",db_name);
    SetDB(db_name,connected);
  });
}

function DbInfo(db_name){
  return new Promise(function(resolve,reject){
    db[db_name].stats(function(err,data){
      resolve({size : (data.dataSize/(1024 * 1024)), collections : data.collections});
    });
  });
}

function SetDB(database_name , database) {
  db[database_name] = database;
}

function GetDB(){
  return db;
}