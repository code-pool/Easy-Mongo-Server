var async = require('async'),
    dbUtils = require('utils/database'),
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

  var listeners = [
                    {
                      'event'   : 'db-info', // get db info
                      'handler' : DbInfo
                    }
                  ];

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
          dbUtils.dbInfo(db_name)
                .then(function(data){
                  console.log(data);
                  BroadcastDbInfo(data);
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
  socket.emit('db-info',data);
}





 



