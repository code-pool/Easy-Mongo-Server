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
  reply('Successfully started db creation');
  dbUtils.connect(request.payload.database)
         .then(function(){
          return dbUtils.initDB(request.payload.database);
         })
         .then(function(){
          socketUtils.broadCast('db-create',{db_name : request.payload.database, stats : {}});
          return dbUtils.dbInfo(request.payload.database);
         })
         .then(function(data){
          data.verified = true;
          data.name = request.payload.database;
          socketUtils.broadCast('db-info',data);
         });
}

function Rename(request,reply) {

}

function Delete(request,reply) {

  var db = dbUtils.getDb();
  db[request.query.database].dropDatabase();
  db[request.query.database] = null;
  setTimeout(function(){
    socketUtils.broadCast('db-delete',request.query.database);
  },5000);
  reply.next();
}