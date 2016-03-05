var async = require('async'),
    socket;

module.exports = {
  initialize : Initialize
};


function Initialize(__socket) {
  
  var listeners = Listeners();
  socket = __socket;

  async.series(listeners.map(function(listObj) {
    return function(cb) {
      socket.on(listObj.event,listObj.handler);
      cb();
    }
  }),function(err,results) {
    console.log('Added listeners for new connection');
  }); 
  
};


function Listeners() {

  var listeners = [
                    {
                      'event'   : 'db-info', // get db info
                      'handler' : DbInfo
                    }
                  ];

  return listeners;

};


function DbInfo(){

}





 



