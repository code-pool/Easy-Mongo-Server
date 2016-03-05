var Series = require('hapi-next'),
    Validator = require('modules/database/validator'),
    Controller = require('modules/database/controller');

module.exports = {
  
  login : {
    method : 'GET',
    path : '/',
    config : {
      auth : {
        strategy : 'token',
        scope : ['admin']
      },
      validate : Validator.validateReqAll(),
      handler : function(request,reply) {

        var series = new Series([
          Validator.all,
          Controller.all
        ]);
        
        series.execute(request,reply);
      }
    }
  },

  deleteDB : {
    method : 'DELETE',
    path : '/database',
    config : {
      auth : {
        strategy : 'token',
        scope : ['admin']
      },
      validate : Validator.validateReqDelete(),
      handler : function(request,reply) {

        var series = new Series([
          Validator.delete,
          Controller.delete
        ]);
        
        series.execute(request,reply);
      }
    }
  }
  
}