var Promise = require('bluebird'),
    dbUtils = require('utils/database'),
    socketUtils = require('utils/socket');

module.exports = {
  list : List,
  add : Add,
  edit : Edit,
  delete : Delete
};

function List(request,reply) {
  
  var db = dbUtils.getDb()[request.params.database],
      skip = request.query.skip || 0,
      limit = request.query.limit || 20,
      collection = request.params.collection;

  db.collection(collection).find({},{'limit' : limit,'skip' : skip}).toArray(function(err,results){
    
    if(err){
      reply.next(err);
      return;
    }

    reply.data = results;
    reply.next();

  });

}

function Add(request,reply) {

}

function Edit(request,reply) {

}

function Delete(request,reply) {
  
}