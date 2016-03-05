var async = require('async'),
    dbUtils = require('utils/database'),
    listener = require('../index').listener,
    io = require('socket.io')(listener),
    socket;

module.exports = {
  initialize : Initialize,
  broadcastDbInfo : BroadcastDbInfo,
  allDbInfo : AllDbInfo
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

  var listeners = [];

  return listeners;

};

function AllDbInfo(){

  var funcArray = [],
      len;

  dbUtils.list()
  .then(function(response){

    len = response.length;

    while(len--){
      funcArray.push((function(db_name){
        return function(cb){
          var dbInfo;
          dbUtils.dbInfo(db_name)
          .then(function(data){
            dbInfo = data;
            return dbUtils.schemaVerified(db_name);
          })
          .then(function(verified){
            dbInfo.verified = verified;
            console.log(dbInfo)
            BroadcastDbInfo(dbInfo);
            cb();
          })
          .catch(function(){
            cb();
          })
        }
      })(response[len].db_name));
    }

    async.parallel(funcArray,function(err,results){
      console.log('Done broadcasting all db information')
    });
  })
}

function BroadcastDbInfo(data) {
  io.sockets.emit('db-info',data);
}





 



