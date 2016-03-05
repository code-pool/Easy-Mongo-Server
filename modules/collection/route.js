var Series = require('hapi-next'),
    Validator = require('modules/collection/validator'),
    Controller = require('modules/collection/controller');

module.exports = {
  
  login : {
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
  }
}