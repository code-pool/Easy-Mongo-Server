var Promise = require('bluebird'),
    authUtils = require('utils/auth');

module.exports = {

  all : All,
  add : Add,
  rename : Rename,
  delete : Delete,

  validateReqAll : ValidateReqAll
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
  reply.next();
}

function ValidateReqAll() {
  return {};
}