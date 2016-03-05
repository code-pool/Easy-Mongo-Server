var Series = require('hapi-next'),
    Validator = require('modules/collection/validator'),
    Controller = require('modules/collection/controller');

module.exports = {
  
  list : {
    method : 'GET',
    path : '/{database}',
    config : {
      auth : {
        strategy : 'token',
        scope : ['admin']
      },
      validate : Validator.validateReqList(),
      handler : function(request,reply) {

        var series = new Series([
          Validator.list,
          Controller.list
        ]);
        
        series.execute(request,reply);
      }
    }
  },

  delete : {
    method : 'DELETE',
    path : '/{database}/{collection}',
    config : {
      auth : {
        strategy : 'token',
        scope : ['admin']
      },
      validate : Validator.validateReqList(),
      handler : function(request,reply) {

        var series = new Series([
          Validator.delete,
          Controller.delete
        ]);
        
        series.execute(request,reply);
      }
    }
  },

  create : {
    method : 'POST',
    path : '/{database}',
    config : {
      auth : {
        strategy : 'token',
        scope : ['admin']
      },
      validate : Validator.validateReqAdd(),
      handler : function(request,reply) {

        var series = new Series([
          Validator.add,
          Controller.add,
          Controller.addDummy
        ]);
        
        series.execute(request,reply);
      }
    }
  },
}