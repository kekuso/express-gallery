var pug = require('pug');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var querystring = require('querystring');
var Gallery = require('./Gallery');

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function (req, res) {
  var locals = req.body;
  Gallery.displayAll(function (err, result) {
    res.render('index', {layout: 'layout', json: result});
  });
});

app.get('/gallery/:id', function (req, res) {
  if(req.params.id === 'new') {
    res.send("Gallery submission form");
  }
  else {
    res.send("Single gallery " + req.params.id);
  }
});

app.post('/gallery', function (req, res) {
    var locals = req.body;
    Gallery.postGallery(locals, function (err, result) {
      if (err) {
        console.log("Client sent picture that already exists.");
        res.send("Picture already exists.");
      }
      else {
        res.render('gallery', result);
      }
    });
});

app.put('/gallery/:id', function (req, res) {
  var locals = req.body;
  res.render('gallery', locals);
});

app.delete('/gallery/:id', function (req, res) {
  res.send("Deleting gallery " + req.params.id);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening on http://%s:%s", host, port);
});