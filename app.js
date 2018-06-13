const express = require('express');
const path = require('path');
const session = require("express-session");
const bodyParser = require("body-parser");
const RateLimit = require('express-rate-limit');
const passport = require("passport");
const Strategy = require("passport-twitter").Strategy;
//const keys = require("./keys")


var app = express();

app.enable('trust proxy');

var index = require('./routes/index');
var polls = require('./routes/polls');
var twitter = require('./routes/twitter');

app.use(express.static(path.join(__dirname,"public")));

app.use(session({
  secret: "whatever",
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

passport.use(new Strategy({
    consumerKey: "hJJaFezMwEVLJTgNtDw2zakRP",
    consumerSecret: "onbdRwxebUcijDqZ2C9IKIlMkvf9crWcwOvsiy36dADwp01UOC",
    callbackURL: "http://localhost:3000/twitter/return"
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

app.listen(3000, function () {
	console.log('Listening on port 3000...');
});
