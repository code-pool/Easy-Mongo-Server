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
  dbInfo : DbInfo,
  schemaVerified : SchemaVerified,
  validDB : ValidDB,
  initDB : InitDB,
  collectionInfo : CollectionInfo,
  collectionSchemaVerified : CollectionSchemaVerified,
  getDummyObj : GetDummyObj
};

function CollectionInfo(db_name,col_name){
  return new Promise(function(resolve,reject){
    db[db_name].collection(col_name).count(function(err,count){
      resolve(count)
    });    
  });
}

function CollectionSchemaVerified(db_name,col_name){
  return new Promise(function(resolve,reject){
    db[db_name].collection('__schema').findOne({'collection' : col_name},function(err,result){
      if(err || !result) {
        resolve(false);
        return
      }
      resolve(true);
    });
  });
}

function List() {

  var databases = [],
      formatted = [],
      len = [],
      currDb,
      blackList = ['admin','test'],
      currObj = {};

  return new Promise(function(resolve,reject){
    db['test'].admin().listDatabases().then(function(data){
      
      databases = data.databases || [];
      len = databases.length;

      while(len--) {

        currDb = databases[len].name;
        if(blackList.indexOf(currDb) >= 0){
          continue;
        }

        currObj = {'db_name' : databases[len].name,'stats' : {}};
        formatted.push(currObj);
        currObj = {};
      }

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

  return new Promise(function(resolve,reject){
    var url = dbServer + db_name;
    MongoClient.connect(url, function(err, connected) {
      console.log("Connected to the database",db_name);
      SetDB(db_name,connected);
      resolve();
    });    
  });

}

function SchemaVerified(db_name) {
  return new Promise(function(resolve,reject){
    db[db_name].collection('__schema').findOne({},function(err,data){
      if(err || !data) {
        resolve(false);
      }
      resolve(true);
    });
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

function ValidDB(db_name){
  if(db[db_name]) {
    return true;
  }
  return false;
}

function InitDB(db_name) {
  return new Promise(function(resolve,reject){
    db[db_name].collection('__schema').insertOne({},function(err,result){
      if(err){
        reject(err);
      }
      resolve();
    });
  });
}

function GetDummyObj(fields){

  var obj = {},
      len = fields.length,
      defaults = {
        'String' : 'demo',
        'Number' : 1,
        'Date' : new Date(),
        'Boolean' : true,
        'Array' : [],
        'Object' : {}
      };

  while(len--) {
    obj[fields[len].key] = defaults[fields[len].type];
  }

  return obj;
}