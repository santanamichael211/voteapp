const express = require('express');
const router = express.Router();
//const mongojs = require('mongojs');
//const keys = require("../keys")
//const db = mongojs("mongodb://user:pass@ds035766.mlab.com:35766/freecodedb",['votes']);
const RateLimit = require('express-rate-limit');


var voteLimiter = new RateLimit({
  windowMs: 1440*60*1000,
  max: 1,
  delayMs:0,
  keyGenerator: function (req /*, res*/) {
    return [req.params.id,req.ip];
},
handler: function (req, res, /*next*/) {
    res.redirect(301,"/polls/"+req.params.id+"?valid=false");
}
});

router.use('/polls/submit/:id', voteLimiter);

router.get("/:id", function(req,res,next){
  /*var id = mongojs.ObjectId(req.params.id);
  db.votes.find({"_id":id},function(err,doc){
    var data = {
      id:id,
      title:doc[0].title,
      list:doc[0].list,
      description:doc[0].description,
      total:doc[0].total,
      creator:doc[0].creator,
      display:doc[0].display,
    }
    if(req.user) data.user = req.user;
    if(req.query.valid == "false"){
      data.voted = "true";
      res.render('poll',data);
    }
    else{
      if(req.query.success == "true") data.success = "true";
      res.render('poll',data);
    }
  });
  */
    res.render('poll');
});

router.delete("/:id", function(req,res){
  /*var id = mongojs.ObjectId(req.params.id);
  db.votes.remove({"_id":id},function(){
    res.end();
  });
*/
});

router.post("/submit/:id", voteLimiter, function(req,res,next){
  /*var id = mongojs.ObjectId(req.params.id);
  var selection = req.body.voteSelection;
  db.votes.update({"_id":id,"list.name":selection},{$inc:{"list.$.value":1,"total":1}},function(err){
    if(err) console.log(err);
    else{
    res.redirect(301,"/polls/"+id+"?success=true");
    }
  });
  */
});



router.get("/add/addpoll/", function(req,res,next){

res.render("add_poll",{user:req.user});
});

router.post("/add/addpoll/", function(req,res,next){
/*
  var list = req.body["list-values"].split(",") ;
list.forEach((element,index)=>{
  list[index] = {
    name:list[index],
    value:0
  }
});
    db.votes.insert({
    title:req.body.pollName,
    list:list,
    description:req.body.description,
    total:0,
    creator:req.user,
    display:req.body.visibility
  },function(err){
    if(err) console.log(err);
    else{
      res.redirect(301,"/?addSuccess=true");
    }
  });
  */
});



module.exports = router;
