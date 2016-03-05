var listener = require('../../index').listener,
    socketUtils = require('../../utils/socket'),
    io = require('socket.io')(listener);


function setup() {
  io.on('connection',function(socket) {
    console.log('received connections');
    socketUtils.initialize(socket);
  });
}

setup();