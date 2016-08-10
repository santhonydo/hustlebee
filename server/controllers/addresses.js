var deleteFunction = require('./addresses_delete.js');
var addFunction = require('./addresses_add.js');

module.exports = function(){
  return {
    add: addFunction,
    delete: deleteFunction
  }
}()
