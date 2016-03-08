var Promise = require('bluebird'),
    dbUtils = require('utils/database'),
    socketUtils = require('utils/socket'),
    fs = require('fs'),
    childProcess = require('child_process');

module.exports = {
  all : All,
  add : Add,
  rename : Rename,
  delete : Delete,
  dump : Dump,
  compress : Compress,
  download : Download
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
        });
}

function Add(request,reply) {
  reply('Successfully started db creation');
  dbUtils.connect(request.payload.database)
         .then(function(){
          return dbUtils.initDB(request.payload.database);
         })
         .then(function(){
          socketUtils.broadCast('db-create',{database : request.payload.database, stats : {}});
          return dbUtils.dbInfo(request.payload.database);
         })
         .then(function(data){
          data.verified = true;
          data.database = request.payload.database;
          setTimeout(function(){
            socketUtils.broadCast('db-info',data)
          },3000);
         });
}

function Rename(request,reply) {

}

function Delete(request,reply) {

  var db = dbUtils.getDb();
  db[request.query.database].dropDatabase();
  db[request.query.database] = null;
  setTimeout(function(){
    socketUtils.broadCast('db-delete',{database : request.query.database});
  },3000);
  reply.next();
}

function Dump(request,reply) {
  var command = 'mongodump --db ' + request.params.database;
  childProcess.exec(command,function(err,success){
    if(err){
      reply.next(err);
      return;
    }
    reply.next();  
  });
}

function Compress(request,reply) {

  dbUtils.compress(request.params.database)
  .then(function(){
    reply.next();
  })
  .catch(function(err){
    reply.next(err);  
  });
  
}

function Download(request,reply) {
  var path = __dirname + '/../../' + request.params.database + '.zip',
      stream = fs.createReadStream(path);
  reply(stream);
}