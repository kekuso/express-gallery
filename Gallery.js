var path = require('path');
var fs = require('fs');

module.exports = {
  postGallery: postGallery,
  displayAll: displayGallery,
  displayPicture: displayPicture,
  putGallery: putGallery
};

var JSON_DATA_PATH = path.resolve('data', 'gallery.json');

function postGallery (data, callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) {
      throw err;
    }
    var galleries = JSON.parse(json);
    var duplicate = false;
    for(var i = 0; i < galleries.length; i++) {
      if(data.title === galleries[i].title) {
        duplicate = true;
      }
    }
    if(duplicate) {
      callback("Picture already exists", data);
    }
    else {
      // Assign ID values
      for(var j = 0; j < galleries.length; j++) {
        galleries[j].id = j;
      }
      data.id = j;
      galleries.push(data);
      fs.writeFile(JSON_DATA_PATH, JSON.stringify(galleries), function(err) {
        callback(err,data);
      });
    }
    duplicate = false;
  });
}

function displayGallery (callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) {
      throw err;
    }
    var parsed = JSON.parse(json);
    //console.log(parsed);
    callback(null, parsed);
  });
}

function displayPicture (id, callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) {
      throw err;
    }
    var parsed = JSON.parse(json);
    // check for invalid id
    if(parseInt(id) < 0 || parseInt(id) > parsed.length) {
      callback("Invalid ID", null);
    }
    for(var i = 0; i < parsed.length; i++) {
      if(parsed[i].id === id) {
        callback(null, parsed[i]);
      }
    }
  });
}

function putGallery (id, data, callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) {
      throw err;
    }
    var parsed = JSON.parse(json);
    for(var i = 0; i < parsed.length; i++) {
      if(parsed[i].id === id) {
        parsed[i] = data;
      }
    }
    fs.writeFile(JSON_DATA_PATH, JSON.stringify(parsed), function(err) {
        callback(err,data);
    });
  });
}