module.exports = function(req, res){
  if(req.body.password == "dojo2015swag"){
    res.json(true);
  }
  else{
    res.json(false);
  }
}
