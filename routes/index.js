const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs(process.env.MONGO_URI,['votet']);


//--------- get all elements in index route
router.get("/", function(req,res,next){
  db.votet.find(function(err,docs){
      var data = {
        docs:docs
      };
      if(req.user) data.user = req.user;
      res.render('index',data);
  });
});


module.exports = router;
