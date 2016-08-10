var AWS = require('aws-sdk');

module.exports = function(req,res){
  AWS.config.loadFromPath('./config/config.json');
  var s3 = new AWS.S3();
  var params = {Bucket: 'hustlebee'};
  s3.listObjectsV2(params, function(err, data){
    res.json(data);
  })
}
