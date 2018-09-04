const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs(process.env.MONGO_URI,['votet']);
const RateLimit = require('express-rate-limit');



//--------- limit voting to 1 vote per day
var voteLimiter = new RateLimit({
  windowMs: 1440*60*1000,
  max: 1,
  delayMs:0,
  keyGenerator: function (req /*, res*/) {
    return [req.params.id,req.ip];
},
handler: function (req, res, /*next*/) {
    res.redirect(301,"/polls/"+req.params.id+"?success=false");
}
});
//--------- limit voting to 1 vote per day

//---- middle ware
router.use('/polls/submit/:id', voteLimiter);
//----- middle ware

//----- get route for specific poll
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
    res.render('poll',data);
  });
});
//----- get route for specific poll

//----- route to remove poll
router.delete("/:id", function(req,res){
  var id = mongojs.ObjectId(req.params.id);
  db.votet.remove({"_id":id},function(){
    res.end();
  });
});
//----- route to remove poll

//--------- route for submitting vote
router.post("/submit/:id", voteLimiter, function(req,res,next){
  var id = mongojs.ObjectId(req.params.id);
  var selection = req.body.voteSelection;
  db.votet.update({"_id":id,"list.name":selection},{$inc:{"list.$.value":1,"total":1}},function(err){
    if(err){
      console.log(err);
      res.redirect(301,"/polls/"+id+"?success=false");
    }
    else{
    res.redirect(301,"/polls/"+id+"?success=true");
    }
  });
});
//--------- route for submitting vote


//------- get add poll form route
router.get("/add/addpoll/", function(req,res,next){
res.render("add_poll",{user:req.user});
});
//------- get add poll form route

//-------- post route to add poll
router.post("/add/addpoll/", function(req,res,next){
  //--obtain list of elements in poll
  var list = req.body["list-values"].split(",") ;

//--- turn recieved string elements to object with name and value pair
list.forEach((element,index)=>{
  list[index] = {
    name:list[index],
    value:0
  }
});
//--- turn recieved string elements to object with name and value pair

// insert poll into database
    db.votet.insert({
    title:req.body.pollName,
    list:list,
    comments:[],
    description:req.body.description,
    total:0,
    creator:req.user.username,
    display:req.body.visibility,
  },function(err){
    if(err) {
      console.log(err);
      res.redirect(301,"/?addSuccess=false");
    }
    else{
      res.redirect(301,"/?addSuccess=true");
    }
  });
});
//-------- post route to add poll


//----- route to add a comment
router.post("/add/addcom/:id",function(req,res,next){
  var id = mongojs.ObjectId(req.params.id);
  var today = new Date();
  var comment = {
    comment:req.body.comment,
    user:req.user.username,
    time:today.getMonth()+ " " + today.getDay() + " " + today.getFullYear() +"-"+ today.getHours()+":"+today.getMinutes()+":"+today.getSeconds(),
    image:req.user.photos[0].value
  };
//---- insert comment at front
  db.votet.update({"_id":id},{$push:{
    "comments":{$each:[comment],$position:0}
  }},function(err){
    if(err){console.log(err);
    res.redirect(301,"/polls/"+id+"?addCom=false");
  }
    else{res.redirect(301,"/polls/"+id+"?addCom=true");}
  });
//---- insert comment at front
});


//---- delete comment route
router.post("/delete/deletecom/:id",function(req,res,next){
var id = mongojs.ObjectId(req.params.id);
var pos = req.query.val;
var query = {};
//query with comment position and setting to null
query["comments."+pos] = null;

//setting comment value at query position to null
db.votet.update({"_id":id},{$set:query},(err)=>{
  if(err) {console.log(err);
    res.redirect(301,"/polls/"+id+"?comDel=false");
  }
  else{
    //pulling elements from comment array with value null
    db.votet.update({"_id":id},{$pull:{comments:null}},(err)=>{
      if(err){ console.log(err);
        res.redirect(301,"/polls/"+id+"?comDel=false");
      }
      else{
        res.redirect(301,"/polls/"+id+"?comDel=true");
      }
    });
  }
});
});
//---- delete comment route


module.exports = router;
