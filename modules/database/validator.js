var Promise = require('bluebird'),
    joi = require('joi'),
    dbSecret = process.env.DB_DELETE_SECRET || 'killme',
    authUtils = require('utils/auth'),
    dbUtils = require('utils/database');

module.exports = {

  all : All,
  add : Add,
  rename : Rename,
  delete : Delete,

  validateReqAll : ValidateReqAll,
  validateReqDelete : ValidateReqDelete
};

function All(request,reply) {
  reply.next();
}

function Add(request,reply) {
  reply.next();
}

function Rename(request,reply) {
  reply.next();
}

function Delete(request,reply) {
  
  if(request.query.secret !== dbSecret) {
    reply.next('Incorrect secret');
    return;
  }

  if(!dbUtils.validDB(request.query.database)) {
    reply.next('Incorrect database name');
    return;
  }

  reply.next();
  
}

function ValidateReqAll() {
  return {};
}

function ValidateReqDelete() {
  return {
    'query' : {
      'database' : joi.string().required(),
      'secret' : joi.string().required()
    }
  }
}