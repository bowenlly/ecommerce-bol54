// Test comment This is a test
// load necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

// import the Passport.js helper function
const setUpPassport = require("./setuppassport");

// Establish a connection with the Mongo Database
// Get the username, password, host, and databse from the .env file
const mongoDB = ("mongodb+srv://"+
                 process.env.USERNAME+
                 ":"
                 +process.env.PASSWORD+
                 "@"
                 +process.env.HOST+
                 "/"
                 +process.env.DATABASE);
mongoose.connect(mongoDB, {useNewUrlParser: true, retryWrites: true});

// Execute Passport helper function
setUpPassport();

// Initialize Express application
const app = express();

// Set the view engine and view directory
app.set("view engine", "ejs")
app.set("views", __dirname + "/views/");

// Set up necessary middleware for sessions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Using connect-mongo for session storage
// https://www.npmjs.com/package/connect-mongo
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection, autoRemove: 'native' })
}));

// Set up Passport middleware
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Load and use external routes file
const routes = require("./routes");
app.use(routes);

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
