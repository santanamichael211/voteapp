const express = require('express');
const router = express.Router();
const passport = require("passport");

//----- twitter login route
router.get("/login", passport.authenticate("twitter"));

// twitter login call back function
router.get("/return", passport.authenticate("twitter",{
  failureRedirect: "/",
  error: "Unable To Redirect"
}), function(req,res){
  res.redirect("/?logIn=true");
})


//---------- log user out
router.get("/logout",function(req,res){
  req.logout();
  res.redirect("/?logOut=true")
})


module.exports = router;
