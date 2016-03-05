var Promise = require('bluebird'),
    dbUtils = require('utils/database'),
    socketUtils = require('utils/socket');

module.exports = {
  list : List,
  add : Add,
  rename : Rename,
  delete : Delete
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
    socketUtils.allCollectionInfo(request.params.database,formatted);
    reply.data = formatted;
    reply.next();
  });
}

function Add(request,reply) {

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