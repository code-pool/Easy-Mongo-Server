var async = require('async'),
    dbUtils = require('utils/database'),
    listener = require('../index').listener,
    io,
    socket;

module.exports = {
  initialize : Initialize,
  allDbInfo : AllDbInfo,
  setIo : SetIO,
  broadCast : BroadCast,
  allCollectionInfo : AllCollectionInfo
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
      reducer = 2, // this is needed because mongodb returns count of hidden collections as well
      len;

  dbUtils.list()
  .then(function(response){

    len = response.length;

    while(len--){
      funcArray.push((function(database){
        return function(cb){
          var dbInfo;
          dbUtils.dbInfo(database)
          .then(function(data){
            dbInfo = data;
            dbInfo.database = database;
            return dbUtils.schemaVerified(database);
          })
          .then(function(verified){
            reducer = 2;
            if(verified) {
              reducer = 3; 
            }
            dbInfo.collections -= reducer;
            dbInfo.verified = verified;
            setTimeout(function(){
              socket.emit('db-info',dbInfo);
              cb();
            },3000);
          })
          .catch(function(err){
            console.log(err)
            cb();
          })
        }
      })(response[len].database));
    }

    async.parallel(funcArray,function(err,results){
      console.log('Done broadcasting all db information')
    });
  });
}

function AllDbInfo(){

}

function AllCollectionInfo(database,collections){
  
  var funcArray = [],
      len = collections.length;

  while(len--) {
    funcArray.push((function(database,col_name){
      return function(cb){
        var info = {};
        dbUtils.collectionInfo(database,col_name)
               .then(function(count){
                info.count = count;
                return dbUtils.collectionSchemaVerified(database,col_name);
               })
               .then(function(verified){
                info.verified = verified;
                info.collection = col_name;
                console.log(info);
                BroadCast('collection-info',info);
                cb();
               })
      }
    })(database,collections[len].collection_name));
  }
  async.parallel(funcArray,function(err,results){
    console.log('Done broadcasting all the information of the collection');
  });
  
}

function BroadCast(event,data){
  io.emit(event,data);
}





 



