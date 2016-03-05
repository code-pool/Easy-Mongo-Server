var Promise = require('bluebird'),
  joi = require('joi'),
  database = require('database')

module.exports = {

  login : Login,
  logout : Logout,

  validateReqLogin : ValidateReqLogin

};

function Login(request,reply) {

  var user = database;
  if(user.username !== request.payload.username || user.password !== request.payload.password) {
    return reply.next({'message' : 'User not found', 'status' : 401});    
  }
  
  reply.data = user;
  reply.next();  
  
}

function Logout(request,reply) {
  
  if(!request.headers.authorization) {
    reply.data = {'logout' : true};
    return reply.next();
  }

  reply.next();

}

function ValidateReqLogin() {
  
  return {
    'payload' : {
      'username' : joi.string().required(),
      'password' : joi.string().required()
    }
  };
}

