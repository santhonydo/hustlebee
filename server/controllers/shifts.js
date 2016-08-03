var mongoose = require('mongoose');
var sendgrid = require('sendgrid')('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');
var postFunction = require('./shifts_post.js');
var getAllFunction = require('./shifts_getAll.js');
var getAvailableShiftsFunction = require('./shifts_getAvailableShifts.js');
var getShiftsFunction = require('./shifts_getShifts.js');
var deleteShiftFunction = require('./shifts_deleteShift.js');
var updateShiftFunction = require('./shifts_updateShift.js');

var Shift = mongoose.model('Shift');

module.exports = function () {
  return {
    postShift: postFunction,
    getAllShifts: getAllFunction,
    getAvailableShifts: getAvailableShiftsFunction,
    getShifts: getShiftsFunction,
    deleteShift: deleteShiftFunction, 
    updateShift: updateShiftFunction 
  }	
}()
