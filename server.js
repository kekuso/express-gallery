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
    var picId = parseInt(req.params.id);
    Picture.findAll({
      where: {
        id: picId
      }
    }).then(function (pictures) {
        res.render('gallery', {json: pictures});
      // console.log("pictures: ", picture);
    }).catch( function(error) {
      if(error) {
        console.log("Client tried accessing a picture that doesn't exist.");
        res.render('404');
      }
    });


    // Picture.findAll({
    //   where: {
    //     id: {
    //       $between: [picId, (picId + 2)]
    //     }
    //   },
    // })
    //   .then(function (pictures) {
    //       res.render('gallery', {json: pictures});
    //     // console.log("pictures: ", picture);
    //   }).catch( function(error) {
    //     console.log("Client tried accessing a picture that doesn't exist.");
    //     res.render('404');
    //   });
  }
});

app.get('/gallery/:id/edit', function (req, res) {
  console.log("req.params.id: ", parseInt(req.params.id));
  Picture.findAll( {where: { id: parseInt(req.params.id)}} )
    .then(function (picture) {
      //console.log("picture data author: ", picture[0].author);
      res.render('edit', {json: picture});
    }).catch(function (error) {
      if(error) {
        console.log("Client tried accessing a picture that doesn't exist.");
        res.render('404');
      }
    });
});

app.post('/gallery', function (req, res) {
    Picture.create({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      description: req.body.description
      })
        .then(function (picture) {
          res.render('gallery', {json: picture});
        }, function (error) {
          if(error) {
            console.log("Picture already exists.");
            res.send("Picture already exists.");
          }
        });
});

app.put('/gallery/:id/edit', function (req, res) {
  Picture.create({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      description: req.body.description
      })
        .then(function (picture) {
          res.render('gallery', {json: picture});
        });
});

app.delete('/gallery/:id', function (req, res) {
  console.log("starting delete");
  Picture.destroy( {
    where: {
      id: parseInt(req.params.id)
    }
  }).then(function (picture) {
    console.log("Client deleted picture ", req.params.id);
    res.render('index', {json: picture, id: parseInt(req.params.id)});
  },function (error) {
      if(error) {
        console.log("Client tried deleting a picture that doesn't exist.");
        res.render('404');
      }
  });
});

var server = app.listen(3000, function () {
  db.sequelize.sync();

  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening on http://%s:%s", host, port);
});