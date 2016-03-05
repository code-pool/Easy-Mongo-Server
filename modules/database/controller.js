var Promise = require('bluebird'),
    dbUtils = require('utils/database'),
    socketUtils = require('utils/socket');

module.exports = {
  all : All,
  add : Add,
  rename : Rename,
  delete : Delete
};

function All(request,reply) {
  dbUtils.list()
        .then(function(data){
          reply.data = data;
          reply.next();
          socketUtils.allDbInfo();
        })
        .catch(function(err){
          reply.next(err);
        })
}

function Add(request,reply) {
  dbUtils.connect(request.payload.database)
         .then(function(){
          return dbUtils.initDB(request.payload.database);
         })
         .then(function(){
          socketUtils.broadcast('db-create',request.payload.database);
          return dbUtils.DbInfo(request.payload.database);
         })
         .then(function(data){
          data.verified = true;
          socketUtils.broadcast('db-info',data);
         });
}

function Rename(request,reply) {

}

function Delete(request,reply) {

  var db = dbUtils.getDb();
  db[request.query.database].dropDatabase();
  db[request.query.database] = null;
  setTimeout(function(){
    socketUtils.broadcast('db-delete',request.query.database);
  },5000);
  reply.next();
}