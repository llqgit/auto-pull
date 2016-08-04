var http = require('http');
var exec = require('child_process').exec;
var path = require('path').resolve();
var extend = require('util')._extend;

var init = function(opt) {
  var config = {
    path: '/chronos_dataservice',
    port: 8080,
    events: ['push'],
    origin: ['github', 'gitlab', 'coding'],
    command: './'
  };
  extend(config, opt);

  var server = http.createServer((req, res) => {
    var req_path = req.url.split('?').shift();
    if (req_path !== config.path) {
      var result = {result: 'fail wrong path'};
      res.end(JSON.stringify(result));
    } else {
      exec(config.command, function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
      });
      var result = {result: 'success'};
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify(result));
    }
  });

  server.listen(config.port);
  console.log('webhook start at localhost:' + config.port + config.path);
};

init({
  command: 'cd /work/project/dataservice;git pull'
});
