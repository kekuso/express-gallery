var path = require('path');
var fs = require('fs');

module.exports = {
  postGallery: postGallery,
  displayAll: displayGallery,
  displayPicture: displayPicture,
  putGallery: putGallery,
  deletePicture: deletePicture
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
    console.log(id);
    console.log(parsed.length);
    if(parseInt(id) < 0 || parseInt(id) > parsed.length - 1) {
      callback("Invalid ID", json);
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
    var duplicate = false;
    var parsed = JSON.parse(json);
    for(var i = 0; i < parsed.length; i++) {
      if(parsed[i].id === id) {
        data.id = i;
        parsed[i] = data;
        duplicate = true;
      }
    }
    if(duplicate) {
      fs.writeFile(JSON_DATA_PATH, JSON.stringify(parsed), function(err) {
        callback(err,data);
      });
    }
    else {
      data.id = i;
      parsed.push(data);
      fs.writeFile(JSON_DATA_PATH, JSON.stringify(parsed), function(err) {
        callback(err,data);
      });
    }
  });
}

function deletePicture (id, data, callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json) {
    if(err) {
      throw err;
    }
    var parsed = JSON.parse(json);
    var found = false;
    for(var i = 0; i < parsed.length; i++) {
      if(parsed[i].id === id) {
        parsed.splice(i, 1);
        found = true;
      }
    }

    if(found) {
      fs.writeFile(JSON_DATA_PATH, JSON.stringify(parsed), function(err) {
        callback(null, parsed);
      });
    }
    else {
      callback("Picture not found.", data);
    }
  });
}