var pug = require('pug');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var querystring = require('querystring');
var Gallery = require('./Gallery');
var methodOverride = require('method-override');
var db = require('./models');

app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('public'));
app.set('view engine', 'pug');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//app.use(express.static(path.resolve(__dirname, 'public')));

var Picture = db.Picture;

app.get('/', function (req, res) {
  var locals = req.body;
  Picture.findAll()
    .then(function (picture) {
      // console.log("pictures: ", picture);
      res.render('index', {json: picture});
    });
});

app.get('/gallery/:id', function (req, res) {
  if(req.params.id === 'new') {
    res.render('newPhoto');
  }
  else {
    console.log("id: " + req.params.id);

    Picture.findAll({
      where: {
        id: { gte: parseInt(req.params.id) }},
        id: { lte: parseInt(req.params.id) }
        })
      .then(function (picture) {
        // console.log("pictures: ", picture);
        res.render('gallery', {json: picture});
      }, function (error) {
        if(error) {
          console.log("Client tried accessing a picture that doesn't exist.");
          res.render('404');
        }
      });
    // Gallery.displayPicture(parseInt(req.params.id), function (err, result) {
    //   if(err) {
    //     console.log("Client tried accessing a picture that doesn't exist.");
    //     res.render('404');
    //   }
    //   else {
    //     // result.mainurl = result.pictureUrl;
    //     // send the picture and the next 3 pictures if they exist
    //     var newResult = [];
    //     for(var i = 0; i < result.length && i < 4; i++) {
    //       newResult.push(result[i]);
    //     }
    //     res.render('gallery', {json: newResult});
    //   }
    // });
  }
});

app.get('/gallery/:id/edit', function (req, res) {
  Picture.findAll( {where: { id: req.body.id}} )
    .then(function (picture) {
      // console.log("pictures: ", picture);
      res.render('edit', {json: picture});
    }, function (error) {
      if(error) {
        console.log("Client tried accessing a picture that doesn't exist.");
        res.render('404');
      }
    });

  // Gallery.displayPicture(parseInt(req.params.id), function (err, result) {
  //   if(err) {
  //     console.log("Client tried accessing a picture that doesn't exist.");
  //     res.render('404');
  //   }
  //   else {
  //     result.mainurl = result.pictureUrl;
  //     res.render('edit', result);
  //   }
  // });
});

app.post('/gallery', function (req, res) {
    var locals = req.body;

    Picture.create({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      description: req.body.description
      })
        .then(function (picture) {
          res.json(picture);
        }, function (error) {
          if(error) {
            console.log("Picture already exists.");
            res.send("Picture already exists.");
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
  db.sequelize.sync();

  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening on http://%s:%s", host, port);
});