const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const keys = require("../keys")
const db = mongojs(keys.mongo,['votes']);

router.get("/", function(req,res,next){
  db.votes.find(function(err,docs){
      var data = {
        docs:docs
      };
      if(req.user) data.user = req.user;
      if(req.query.addSuccess == "true") data.addSuccess = "true";
      res.render('index',data);
  });

});


module.exports = router;
