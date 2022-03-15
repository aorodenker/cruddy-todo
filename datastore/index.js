const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
var readFilePromise = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
// var nodeStyle = require('./callbackReview.js');
// var pluckFirstLineFromFileAsync = Promise.promisify(nodeStyle.pluckFirstLineFromFile)
// var getStatusCodeAsync = Promise.promisify(nodeStyle.getStatusCode)

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
//use Promise.all
exports.readAll = (callback) => {
  // var storage = [];
  fs.readdir(exports.dataDir, function(err, data) {
    if (err) {
      throw ('error');
    }
    var mapping = _.map(data, file => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath).then(fileData => {
        return {
          id: id, text: fileData.toString()
        };
      });
    });
    Promise.all(mapping).then((values) => {
      callback(null, values), err => callback(err);
    });
  });
};




//    Promise.all(data)
// .then(items => callback(null, items), err => callback(err));
// });

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

// Config+Initialization code -- DO NOT MODIFY ////////////////////////////////
// var createAsync = Promise.promisify(exports.create);
// var readAllAsync = Promise.promisify(exports.readAll);
// var readOneAsync = Promise.promisify(exports.readOne);
// var updateAsync = Promise.promisify(exports.update);
// var deleteAsync = Promise.promisify(exports.delete);
// Promise.all([createAsync, readAllAsync, readOneAsync, updateAsync, deleteAsync]).then((values) => {
//   console.log(values);
// });

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
