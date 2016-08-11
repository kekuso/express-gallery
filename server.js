var pug = require('pug');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var querystring = require('querystring');
var Gallery = require('./Gallery');
var methodOverride = require('method-override');
var db = require('./models');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var CONFIG = require('./config/config');

var app = express();
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(
  {
    secret: CONFIG.SESSION.secret,
    saveUninitialized: CONFIG.SESSION.saveUninitialized,
    resave: CONFIG.SESSION.resave,
    store : new RedisStore({ttl: 300})
  })
);

var Picture = db.Picture;
var User = db.User;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("username: ", username);
    console.log("password: ", password);
    // var isAuthenticated;
    User.findOne({
      where: {
        name: username,
        password: password
      }
    }).then(function (user) {
      if(user) {
        console.log("user found");
        return done(null, user);
      }
      else {
        console.log("user not found");
        return done(null, false);
      }
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
}); //this gets saved into session store

passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then(function (user) {
      return done(null, (user && user.toJSON()));
    })
    .catch(function(err) {
      return done(err);
    });
}); // this becomes req.user

app.get('/', function (req, res) {
  var locals = req.body;
  Picture.findAll({
    include: ({
      model: User,
      as: 'user',
      required: true
    })
  })
    .then(function (picture) {
      var partialArray = picture.slice(0, 7);
      res.render('index', {json: partialArray});
    });
});

app.get('/login', function (req, res) {
  res.render('login');
});

function isAuthenticated (req, res, next) {
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  return next();
}

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
  }));

app.get('/secret',
  isAuthenticated,
  function (req, res) {
    res.render('secret');
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

app.get('/gallery/new',
  isAuthenticated,
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

var needsRole = function (role) {
  return function(req, res, next) {
    if (req.user && req.user.role === role) {
      next();
    }
    else {
      console.log("Client has insufficient permissions.");
      res.render('401');
    }
  };
};

app.get('/gallery/:id/edit',
  isAuthenticated,
  needsRole('Admin'),
  function (req, res) {
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

app.post('/gallery',
  isAuthenticated,
  function (req, res) {
    console.log("Session user: " + req.session.name);
    Picture.findOne({
      where: {
        title: req.body.title
      }
    })
    .then(function (picture) {
      if(picture) {
        res.render('409');
      }
      else {
        console.log(req.session.passport.user);
        Picture.create({
          title: req.body.title,
          author: req.body.author,
          url: req.body.url,
          description: req.body.description,
          user_id: req.session.passport.user
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

app.put('/gallery/:id/edit',
  isAuthenticated,
  needsRole('Admin'),
  function (req, res) {
  Picture.findOne({
    where: {
      id: parseInt(req.params.id)
    }
  }).then(function (picture) {
    if(picture) {
      return picture.updateAttributes({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        description: req.body.description,
        updatedAt: new Date()
      }).then(function (picture) {
        console.log("User successfully edited picture");
        return res.render('success');
      })
      .catch(function(error) {
        console.log("ERROR: " + error);
        console.log("Picture title already exists");
        return res.render('409');
      });
    }
    else {
      console.log("Unable to find picture.");
      return res.render('404');
    }
  });
});

app.delete('/gallery/:id',
  isAuthenticated,
  needsRole('Admin'),
  function (req, res) {
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

app.get('*', function (req, res) {
  res.render('404');
});

var server = app.listen(3000, function () {
  db.sequelize.sync();
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening on http://%s:%s", host, port);
});