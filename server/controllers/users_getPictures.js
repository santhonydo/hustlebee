module.exports = function(req,res){
  AWS.config.loadFromPath('./config/config.json');
  var s3 = new AWS.S3();
  var params = {Bucket: 'hustlebee', Key: "photoID/" + req.body._id};
  s3.getSignedUrl('getObject', params, function (err, url) {
    res.json(url)
  });
}
