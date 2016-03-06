var Promise = require('bluebird'),
    joi = require('joi'),
    dbSecret = process.env.DB_DELETE_SECRET || 'killme',
    authUtils = require('utils/auth'),
    dbUtils = require('utils/database');

module.exports = {

  list : List,
  add : Add,
  rename : Rename,
  delete : Delete,

  validateReqList : ValidateReqList,
  validateReqDelete : ValidateReqDelete,
  validateReqAdd : ValidateReqAdd
};

function List(request,reply) {
  if(dbUtils.validDB(request.params.database)) {
    reply.next();
    return;
  }
  reply.next('No database found');
}

function Add(request,reply) {
  reply.next();
}

function Rename(request,reply) {
  reply.next();
}

function Delete(request,reply) {

  if(dbUtils.validDB(request.params.database)) {
    reply.next();
    return;
  }
  reply.next('No database found');
  
}

function ValidateReqList() {
  return {
    'params' :{
      'database' : joi.string().required(),
      'collection' : joi.string().required()
    }
  };
}

function ValidateReqAdd() {
  return { 

  };
}

function ValidateReqDelete() {
  return {
  };
}