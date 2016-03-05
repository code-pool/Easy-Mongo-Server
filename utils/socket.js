var async = require('async'),
    dbUtils = require('utils/database'),
    listener = require('../index').listener,
    io,
    socket;

module.exports = {
  initialize : Initialize,
  allDbInfo : AllDbInfo,
  setIo : SetIO,
  broadCast : BroadCast
};

function SetIO(io_connected){
  io = io_connected;
}

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
      'event' : 'db-info',
      'handler' : DbInfo
    }
  ];

  return listeners;

};

function DbInfo() {

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
            dbInfo.name = db_name;
            return dbUtils.schemaVerified(db_name);
          })
          .then(function(verified){
            dbInfo.verified = verified;
            socket.emit('db-info',dbInfo);
            cb();
          })
          .catch(function(err){
            console.log(err)
            cb();
          })
        }
      })(response[len].db_name));
    }

    async.parallel(funcArray,function(err,results){
      console.log('Done broadcasting all db information')
    });
  });
}

function AllDbInfo(){

}

function BroadCast(event,data){
  io.emit(event,data);
}





 



