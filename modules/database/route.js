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
  },

  create : {
    method : 'POST',
    path : '/',
    config : {
      auth : {
        strategy : 'token',
        scope : ['admin']
      },
      validate : Validator.validateReqAll(),
      handler : function(request,reply) {

        var series = new Series([
          Validator.add,
          Controller.add
        ]);
        
        series.execute(request,reply);
      }
    }
  },

  zip : {
    method : 'GET',
    path : '/database/zip/{database}',
    config : {
      // auth : {
      //   strategy : 'token',
      //   scope : ['admin']
      // },
      validate : Validator.validateReqDownload(),
      handler : function(request,reply) {

        var series = new Series([
          Validator.dump,
          Controller.dump,
          Controller.compress
        ]);
        
        series.execute(request,reply);
      }
    }
  },

  download : {
    method : 'GET',
    path : '/database/download/{database}',
    config : {
      // auth : {
      //   strategy : 'token',
      //   scope : ['admin']
      // },
      validate : Validator.validateReqDownload(),
      handler : function(request,reply) {

        var series = new Series([
          Validator.download,
          Controller.download
        ]);
        
        series.execute(request,reply);
      }
    }
  }
  
}