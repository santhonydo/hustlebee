var adminLoginFunction = require('./users_adminLogin.js');
var adminDeleteFunction = require('./users_adminDelete.js');
var getInfoFunction = require('./users_getInfo.js');
var checkPictureUpdateFunction = require('./users_checkPictureUpdates.js');
var getPicturesFunction = require('./users_getPictures.js');
var uploadPictureFunction = require('./users_uploadPicture.js');
var getUserFunction = require('./users_getUser.js');
var updateFunction = require('./users_update.js');
var employeeUpdateFunction = require('./users_employeeUpdate.js');
var adminUpdateFunction = require('./users_adminUpdate.js');
var resetFunction = require('./users_reset.js');
var hustlebeeSignupFunction = require('./users_hustlebeeSignup.js');
var addCardFunction = require('./users_addCard.js');

module.exports = (function(){
  return {
    adminDelete: adminDeleteFunction,
    adminLogin: adminLoginFunction,
    getInfo: getInfoFunction,
    checkPictureUpdates: checkPictureUpdateFunction,
    getPictures: getPicturesFunction, 
    uploadPicture: uploadPictureFunction, 
    getUser: getUserFunction,
    update: updateFunction, 
    employeeUpdate: employeeUpdateFunction, 
    adminUpdate: adminUpdateFunction, 
    reset: resetFunction, 
    hustlebeeSignup: hustlebeeSignupFunction,
    addCard: addCardFunction
  }
})()

var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
