const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs("mongodb://123:password1@ds035766.mlab.com:35766/freecodedb",['votet']);
const RateLimit = require('express-rate-limit');
const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
  var id = mongojs.ObjectId(req.params.id);
  db.votet.find({"_id":id},function(err,doc){
    var data = {
      id:id,
      title:doc[0].title,
      list:doc[0].list,
      description:doc[0].description,
      total:doc[0].total,
      creator:doc[0].creator,
      display:doc[0].display,
      comments:doc[0].comments
    }
    if(req.user) data.user = req.user;
    if(req.query.valid == "false"){
      data.voted = "true";
      res.render('poll',data);
    }
    else{
      if(req.query.success == "true") data.success = "true";
      if(req.query.com == "true") data.com = "true";
      res.render('poll',data);
    }
  });
});

router.delete("/:id", function(req,res){
  var id = mongojs.ObjectId(req.params.id);
  db.votet.remove({"_id":id},function(){
    res.end();
  });

});

router.post("/submit/:id", voteLimiter, function(req,res,next){
  var id = mongojs.ObjectId(req.params.id);
  var selection = req.body.voteSelection;
  db.votet.update({"_id":id,"list.name":selection},{$inc:{"list.$.value":1,"total":1}},function(err){
    if(err) console.log(err);
    else{
    res.redirect(301,"/polls/"+id+"?success=true");
    }
  });
});



router.get("/add/addpoll/", function(req,res,next){

res.render("add_poll",{user:req.user});
});

router.post("/add/addpoll/", function(req,res,next){

  var list = req.body["list-values"].split(",") ;
list.forEach((element,index)=>{
  list[index] = {
    name:list[index],
    value:0
  }
});
    db.votet.insert({
    title:req.body.pollName,
    list:list,
    comments:[],
    description:req.body.description,
    total:0,
    creator:req.user.username,
    display:req.body.visibility,
  },function(err){
    if(err) console.log(err);
    else{
      res.redirect(301,"/?addSuccess=true");
    }
  });
});

router.post("/add/addcom/:id",function(req,res,next){
  var id = mongojs.ObjectId(req.params.id);
  var today = new Date();
  var comment = {
    comment:req.body.comment,
    user:req.user.username,
    time:month[today.getMonth()]+ " " + today.getDay() + " " + today.getFullYear() +"-"+ today.getHours()+":"+today.getMinutes()+":"+today.getSeconds(),
    image:req.user.photos[0].value
  };

  db.votet.update({"_id":id},{$push:{
    "comments":{$each:[comment],$position:0}
  }},function(err){
    if(err){console.log(err);}
    else{res.redirect(301,"/polls/"+id+"?com=true");}
  });
});

router.post("/delete/deletecom/:id",function(req,res,next){
var id = mongojs.ObjectId(req.params.id);
var pos = "comments." + req.query.val;


db.votet.update({"_id":id},{$set:{"pos":null}},function(err){
  if(err)console.log(err);
  else{
    db.votet.update({"_id":id},{$pull:{"comments":null}},function(err){
      if(err)console.log(err);
      else{
      res.redirect(301,"/polls/"+id+"?comdel=true");
      }
    });
  }
});
});


module.exports = router;
