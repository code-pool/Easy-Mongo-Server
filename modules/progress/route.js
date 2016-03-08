var Series = require('hapi-next');

module.exports = {
  
  list : {
    method : 'GET',
    path : '/dump',
    config : {
      handler : function(request,reply) {
        reply('Compressing database...');
      }
    }
  }
}