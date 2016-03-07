var Promise = require('bluebird'),
    dbUtils = require('utils/database'),
    socketUtils = require('utils/socket');

module.exports = {
  list : List,
  add : Add,
  rename : Rename,
  delete : Delete,
  addDummy : AddDummy
};

function List(request,reply) {
  
  var db = dbUtils.getDb(),
      len,
      colName,
      blackList = ['system.indexes','__schema'],
      formatted = [];

  db[request.params.database].collections(function(err,collections){
    len = collections.length;
    while(len--){
      colName = collections[len]['s'].name;
      if(blackList.indexOf(colName) >= 0){
        continue;
      }
      formatted.push({'collection_name' : colName,'stats': {}});
    }
    setTimeout(function(){
      socketUtils.allCollectionInfo(request.params.database,formatted);
    },2000);
    reply.data = formatted;
    reply.next();
  });
}

function Add(request,reply) {
  var db = dbUtils.getDb();
  console.log(db[request.params.database])
  db[request.params.database].collection('__schema').insert(request.payload,function(err,result){
    console.log(err);
    reply.next();
  });
}

function AddDummy(request,reply){

  var db = dbUtils.getDb(),
      obj = dbUtils.getDummyObj(request.payload.fields);

  db[request.params.database].collection(request.payload.collection).insert(obj,function(err,results){
    console.log(err);
    console.log(results);
    setTimeout(function(){
      socketUtils.broadCast('collection-info',{'name' : request.payload.collection,'count' : 1,'verified' : true });
    },3000);
    reply.next();
  });
}

function Rename(request,reply) {

}

function Delete(request,reply) {
  
  var db = dbUtils.getDb(),
      db_name = request.params.database,
      col_name = request.params.collection;

  db[db_name].collection(col_name).drop(function(err,results){
    socketUtils.broadCast('collection-delete',{'database' : db_name,'collection' : col_name });
  });

  reply.next();
}