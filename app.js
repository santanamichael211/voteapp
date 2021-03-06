const express = require('express');
const path = require('path');
const session = require("express-session");
const bodyParser = require("body-parser");
const RateLimit = require('express-rate-limit');
const passport = require("passport");
const Strategy = require("passport-twitter").Strategy;


var app = express();

app.enable('trust proxy');

app.set("port",(process.env.PORT || 5000));

var index = require('./routes/index');
var polls = require('./routes/polls');
var twitter = require('./routes/twitter');

app.use(express.static(path.join(__dirname,"public")));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

passport.use(new Strategy({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callbackURL: process.env.CALL_BACK
  },
  function(token, tokenSecret, profile, done) {
    done(null,profile);
  }
));

passport.serializeUser(function(user,callback){
  callback(null,user);
})

passport.deserializeUser(function(obj,callback){
  callback(null,obj);
})

app.use(passport.initialize());
app.use(passport.session());


app.set("views", path.join(__dirname,"views"));
app.set("view engine","pug");

app.use("/",index);
app.use("/polls",polls);
app.use("/twitter",twitter);

app.listen(app.get("port"), function () {
	console.log('Listening on port ' + app.get("port"));
});
