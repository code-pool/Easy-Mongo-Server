require('dotenv').load();

var hapi = require('hapi'),
    server;

server = module.exports = new hapi.Server();        
server.connection({'port' : process.env.NODE_PORT || 3000,'routes' : {'cors' : { 'origin' : ['http://localhost:8000']}}});

require('database');

require('modules');

require('bootstrap');

server.start(function() {
  console.log('Server is up and running');
});