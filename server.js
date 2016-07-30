var pug = require('pug');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var querystring = require('querystring');
var Gallery = require('./Gallery');
var methodOverride = require('method-override');
var db = require('./models');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var app = express();
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var Picture = db.Picture;

var user = { username: 'bob', password: 'secret4', email: 'bob@example.com' };
passport.use(new BasicStrategy(
  function(username, password, done) {
    // Example authentication strategy using
    if ( !(username === user.username && password === user.password) ) {
      return done(null, false);
    }
    return done(null, user);
}));

app.get('/', function (req, res) {
  var locals = req.body;
  Picture.findAll()
    .then(function (picture) {
      res.render('index', {json: picture});
    });
});

app.get('/gallery/new', passport.authenticate('basic', { session: false }),
    function (req, res) {
      res.render('newPhoto');
    });

app.get('/gallery/:id', function (req, res) {
  var picId = parseInt(req.params.id);
  Picture.findOne({
    where: {
      id: picId
    }
  }).then(function (picture) {
    if(!picture) {
      console.log("Client tried accessing a picture that doesn't exist.");
      res.render('404');
    }
    Picture.findAll({
      where: {
        id: {
          $between: [picId, (picId + 3)]
        }
      }
    }).then(function (pictures) {
      if(pictures.length > 0) {
        res.render('gallery', {json: pictures, id: parseInt(req.params.id)});
      }
      else {
        console.log("No pictures to display to client.");
        res.render('404');
      }
    });
  });
});

passport.authenticate('basic', { session: false });

app.get('/gallery/:id/edit', function (req, res) {
  Picture.findAll( {where: { id: parseInt(req.params.id)}} )
    .then(function (picture) {
      if(picture.length > 0) {
        res.render('edit', {json: picture, id: parseInt(req.params.id)});
      }
      else {
        console.log("Client tried accessing a picture that doesn't exist.");
        res.render('404');
      }
    }).catch(function (error) {
      if(error) {
        console.log("Client tried accessing a picture that doesn't exist.");
        res.render('404');
      }
    });
});

app.post('/gallery', function (req, res) {
  var duplicate = false;
  Picture.findOne({
    where: {
      title: req.body.title
    }
  }).then(function (picture) {
    if(picture) {
      console.log("setting duplicate as true.");
      res.send("Picture already exists.");
    }
    else {
      Picture.create({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      description: req.body.description,
      })
        .then(function (picture) {
          res.render('success');
        }).catch(function (error) {
          console.log(error);
          res.send("Unable to add picture.");
        });
    }
  });
});

app.put('/gallery/:id/edit', function (req, res) {
  Picture.find( {
    where: {
      id: parseInt(req.params.id)
    }
  }).then(function (picture) {
    if(picture) {
      picture.updateAttributes({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        description: req.body.description
      });

      res.render('success');
    }
    else {
      console.log("Unable to find picture.");
      res.render('404');
    }
  });
});

app.delete('/gallery/:id', function (req, res) {
  Picture.destroy( {
    where: {
      id: parseInt(req.params.id)
    }
  }).then(function (picture) {
    console.log("Client deleted picture ", req.params.id);
    res.render('deleteSuccess');
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