var AWS = require('aws-sdk');

module.exports = function(req,res){
  AWS.config.loadFromPath('./config/config.json');
  var file = req.file;
  fs.readFile(file.path, function (err, data) {
    if (err) throw err;
    var s3bucket = new AWS.S3({params: {Bucket: 'hustlebee'}});
    s3bucket.createBucket(function () {
      var params = {
        Key: 'photoID/'+ req.body.userId,
        Body: data
      };
      s3bucket.upload(params, function (err, data) {
        fs.unlink(file.path, function (err) {
          if (err) {
          }
        });
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).end();
        }
      });
    });
  });
}
