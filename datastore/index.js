const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // getNextUniqueId function needs callback
  //fs.writeFile (exports.dataDir, text, callback)
  counter.getNextUniqueId((err, id) => {
    // console.log('ID', id);

    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (err) {
        throw ('error');
      } else {
        items[id] = text;
        // console.log('ITEMS', items)
        // console.log('TEXT', text)
        // console.log(items[id])
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  var storage = [];
  fs.readdir(exports.dataDir, function(err, data) {
    _.map(data, file => {
      var arrayFile = file.split('.');
      var id = arrayFile[0];
      storage.push({id, text: id});
    });
    callback(null, storage);
  });
};

exports.readOne = (id, callback) => {
  //use fs.readfile (data )
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (err, text) => {
    var text = items[id];
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  // check if a file exists fs.existsync(path)
  // update file with fs.writeFile

  if (fs.existsSync(path.join(exports.dataDir, id + '.txt'))) {
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (err) {
        throw ('error');
      } else {
        items[id] = text;
        callback(null, {id, text});
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  fs.unlink (path.join(exports.dataDir, id + '.txt'), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
