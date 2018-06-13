const express = require('express');
const router = express.Router();
const passport = require("passport");


router.get("/login", passport.authenticate("twitter"));

router.get("/return", passport.authenticate("twitter",{
  failureRedirect: "/",
  error: "Unable To Redirect"
}), function(req,res){
  res.redirect("/");
})


module.exports = router;
