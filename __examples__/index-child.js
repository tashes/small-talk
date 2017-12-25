var smalltalk = require('../index.js')();

smalltalk.start('bloop', process, "hello")
.reply(function (data) {
  console.log(data);
  return data += "\nHow are you doing??"
})
.reply(function (data) {
  console.log(data);
})
.done();
