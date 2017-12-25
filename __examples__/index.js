var fork = require('child_process').fork;
var smalltalk = require('../index.js')();

child = fork('./__examples__/index-child.js');

smalltalk.respond('bloop', child, function (data) {
  console.log(data);
  return data += "\nHello There.";
})
.reply("Not too bad really.")
.done();

process.stdin.resume();
