// Generated by CoffeeScript 1.9.2
(function() {
  var exec;

  exec = require("child_process").exec;

  module.exports = function(app) {
    app.get('/miro', function(req, res) {
      return res.render('miro/views/index');
    });
    return app.get('/api/reply', function(req, res) {
      var question;
      question = req.query['question'];
      console.log('question = ' + question);
      return exec('ruby miro/algo/findEye.rb ' + question, function(err, stdout, stderr) {
        var reply, replys;
        if (err) {
          console.log('server err = ' + err + ', stderr = ' + stderr);
          return res.status(404).send('server err');
        } else {
          console.log('success');
          console.log('stdout: ' + stdout);
          replys = stdout.split('\n');
          console.log(replys);
          reply = {};
          reply['words'] = replys[0];
          reply['song_name'] = replys[1];
          reply['sentence'] = replys[2];
          reply['youtube_url'] = replys[3];
          reply['youtube_embed_url'] = 'http://www.youtube.com/embed/' + replys[3].split('v=')[1];
          console.log('reply = ' + reply);
          return res.send(reply);
        }
      });
    });
  };

}).call(this);
