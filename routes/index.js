const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const keys = require("./keys")
const db = mongojs(keys.mongo,['votet']);

router.get("/", function(req,res,next){
  db.votet.find(function(err,docs){
      var data = {
        docs:docs
      };
      if(req.user) data.user = req.user;
      if(req.query.addSuccess == "true") data.addSuccess = "true";
      res.render('index',data);
  });

});


module.exports = router;
