var Promise = require('bluebird'),
    dbUtils = require('utils/database');

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
        })
        .catch(function(err){
          reply.next(err);
        })
}

function Add(request,reply) {

}

function Rename(request,reply) {

}

function Delete(request,reply) {

}