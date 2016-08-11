var postFunction = require('./shifts_post.js');
var getAllFunction = require('./shifts_getAll.js');
var getAvailableShiftsFunction = require('./shifts_getAvailableShifts.js');
var getShiftsFunction = require('./shifts_getShifts.js');
var deleteShiftFunction = require('./shifts_deleteShift.js');
var updateShiftFunction = require('./shifts_updateShift.js');

module.exports = function () {
  return {
    postShifts: postFunction,
    getAllShifts: getAllFunction,
    getAvailableShifts: getAvailableShiftsFunction,
    getShifts: getShiftsFunction,
    deleteShift: deleteShiftFunction, 
    updateShift: updateShiftFunction 
  }	
}()
