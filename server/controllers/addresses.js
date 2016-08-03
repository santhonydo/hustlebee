var mongoose = require('mongoose');
var Address = mongoose.model('Address');
var deleteFunction = require('./addresses_delete.js');
var addFunction = require('./addresses_add.js');
var User = mongoose.model('User');

module.exports = function(){
  return {
    add: addFunction,
    delete: deleteFunction
  }
}()
