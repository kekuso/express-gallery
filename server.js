var pug = require('pug');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var querystring = require('querystring');
var Gallery = require('./Gallery');
var methodOverride = require('method-override');

app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('public'));
app.set('view engine', 'pug');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
//app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', function (req, res) {
  var locals = req.body;
  Gallery.displayAll(function (err, result) {
    res.render('index', {json: result});
  });
});

app.get('/gallery/:id', function (req, res) {
  var numPictures;
  if(req.params.id === 'new') {
    var success = "Thank you. Picture received.";
    var failure = "Whoops! There was a problem sending your picture.";
    res.render('newPhoto');
  }
  else {
    console.log("id: " + req.params.id);
    Gallery.displayPicture(parseInt(req.params.id), function (err, result) {
      if(err) {
        console.log("Client tried accessing a picture that doesn't exist.");
        res.render('404');
      }
      else {
        //result.mainurl = result.pictureUrl;
        // send the picture and the next 3 pictures if they exist
        var newResult = [];
        for(var i = 0; i < result.length && i < 4; i++) {
          newResult.push(result[i]);
        }
        res.render('gallery', {json: newResult});
      }
    });
  }
});

app.get('/gallery/:id/edit', function (req, res) {
  Gallery.displayPicture(parseInt(req.params.id), function (err, result) {
    if(err) {
      console.log("Client tried accessing a picture that doesn't exist.");
      res.render('404');
    }
    else {
      result.mainurl = result.pictureUrl;
      res.render('edit', result);
    }
  });
});

app.post('/gallery', function (req, res) {
    var locals = req.body;
    Gallery.postGallery(locals, function (err, result) {
      if (err) {
        console.log("Client sent picture that already exists.");
        res.send("Picture already exists.");
      }
      else {
        result.mainurl = result.pictureUrl;
        res.render('gallery', result);
      }
    });
});

app.put('/gallery/:id/edit', function (req, res) {
  var locals = req.body;
  Gallery.putGallery(parseInt(req.params.id), locals, function (err, result) {
    if(err) {
      throw err;
    }
    result.mainurl = result.pictureUrl;
    res.render('edit', result);
  });
});

app.delete('/gallery/:id', function (req, res) {
  var locals = req.body;
  Gallery.deletePicture(parseInt(req.params.id), locals, function (err, result) {
    if(err) {
      console.log("Client tried deleting a picture that doesn't exist.");
      res.render('404');
    }
    else {
      console.log("Removed picture ID: " + req.params.id);
      var id = result.id;
      res.render('index', {json: result, id: id});
    }
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening on http://%s:%s", host, port);
});