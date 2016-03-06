var Series = require('hapi-next'),
    Validator = require('modules/document/validator'),
    Controller = require('modules/document/controller');

module.exports = {
  
  list : {
    method : 'GET',
    path : '/{database}/{collection}',
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