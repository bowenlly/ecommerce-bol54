// Route handlers
const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');

//import data models
const User = require("./models/user");
const Product = require("./models/product");
const Customer = require("./models/customer");

// Make user information available to templates
router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.shoppingCart = req.session.cart
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});



// router.get("/", function(req,res){
//   Product.find({}, function (err, p_list){
//     // console.log(p_list);
//     res.render("index", {products:p_list});
//   });
// });

router.get('/', function(req, res) {
   axios.get("https://ecommerce-back-bol54.glitch.me/products")
    .then((results) => {
     var data = results.data;
      res.render("index", {products:data});
      });      
});

router.get('/admin', function(req, res) {
   axios.get("https://ecommerce-back-bol54.glitch.me/admin")
    .then((results) => {
     var data = results.data;
      res.render("admin", {regions:data.regions, category:data.category});
      });      
});

router.get('/admin/sales', function(req, res) {
   axios.get("https://ecommerce-back-bol54.glitch.me/sales")
    .then((results) => {
     var data = results.data;
      res.render("sales", {products:data});
      });      
});

// router.get("/admin", function(req, res){
//   res.render("admin");
// });

router.get("/admin/products", function(req, res){
   axios.get("https://ecommerce-back-bol54.glitch.me/products")
  .then((results) => {
   var data = results.data;
    res.render("products", {products:data});
    });   
});

router.get("/admin/products/:pid", function(req, res){
   axios.get("https://ecommerce-back-bol54.glitch.me/products/"+req.params.pid)
  .then((results) => {
   var data = results.data;
    res.render("inventory", {products:data});
    });   
});

router.post("/admin/products/:pid", function(req, res){
  
  console.log(req.body)
  axios.post("https://ecommerce-back-bol54.glitch.me/products/"+req.params.pid, {data:req.body})
  res.redirect("/admin/products")
});


router.post("/search", function(req,res){
    axios.post("https://ecommerce-back-bol54.glitch.me/search", {data:req.body})
  .then((results) => {
   var data = results.data;
    res.render("index", {products:data});
    });   
});


// router.post("/search", function(req,res){
//   Product.find({}, function (err, p_list){
//     console.log(req.body);
//     res.render("index", {products:p_list});
//   });
// });

// router.get("/cart", function(req, res){
//   var sessData = req.session;
//   Product.find({
//     'product_id': { $in: sessData.cart}
//     }, function(err, docs){
//       // console.log(docs);
//       res.render("cart", {products: docs});
//     });
// });

router.get("/cart", function(req, res){
  var sessData = req.session;
  console.log(sessData.cart)
  axios.post("https://ecommerce-back-bol54.glitch.me/cart", {data:sessData.cart})
  .then((results) => {
   var data = results.data;
    res.render("cart", {products: data});
    });    
});

router.post("/cart", function(req, res){
  var sessData = req.session;
  if (!sessData.cart) {
    sessData.cart = []
  }
  if (!sessData.cart.includes(req.body.product_id)){
    sessData.cart.push(req.body.product_id)
  }
  res.status(204).send()
});

router.post("/cart/remove", function(req, res){
  var sessData = req.session;
  if (!sessData.cart) {
    sessData.cart = []
  }
  var index = sessData.cart.indexOf(req.body.product_id);
  if (index !== -1) {
    sessData.cart.splice(index, 1);
  }
  res.redirect("/cart")
});

router.post("/cart/checkout", function(req, res){
  
  var order = JSON.parse(req.body.order)
  req.body.order = order
  var sessData = req.session;
  sessData.cart = []
  axios.post("https://ecommerce-back-bol54.glitch.me/checkout", {data:req.body})
  res.redirect("/order")
});

router.get("/order", function(req, res){
  res.render("order");
});

// Route to signup page
router.get("/signup", function(req, res){
  res.render("signup");
});

// Route to signup page
router.get("/signup/business", function(req, res){
  res.render("signup2");
});


router.post("/signup", function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  var kind = req.body.kind;
  if (!username.length || !password.length){
    req.flash("error", "Customer ID or Password cannot be empty!");
      return res.redirect("/signup");
  }
  console.log(req.body)
  User.findOne({username: username }, function(err, user){   
    if (err) {return next(err);}
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/signup");
    }
    if (kind === "home"){
      var customer = {
        customer_id: req.body.username,
        kind: req.body.kind,
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        marriage: req.body.marriage,
        income: req.body.income,
      }
      axios.post("https://ecommerce-back-bol54.glitch.me/signup", {data:customer})
      // var newCustomer = new Customer(customer);
      // newCustomer.save()
    } else if (kind === "business") {
      var customer = {
        customer_id: req.body.username,
        kind: req.body.kind,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        business_category: req.body.business_category,
        annual_income: req.body.annual_income,
      }
      axios.post("https://ecommerce-back-bol54.glitch.me/signup", {data:customer})
      // var newCustomer = new Customer(customer);
      // newCustomer.save(next)
    }
    
    var newUser = new User({
      username: username,
      password: password
    });
    console.log(username);
    newUser.save(next);
  });
  }, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "signup",
    failureFlash: true
  
  }));

// profile page
router.get("/users/:username", function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
     axios.get("https://ecommerce-back-bol54.glitch.me/users/"+req.params.username)
      .then((results) => {
       var cust = results.data;
       console.log(cust)
        res.render("profile", { user: user, cus: cust });   
        });   
    // Customer.findOne({ customer_id: req.params.username }, function(err, cust) {
    //   res.render("profile", { user: user, cust: cust });   
    // }); 
  });
});

// route to login page
router.get("/login", function(req, res){
  res.render("login");
});

router.post("/login", passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

// route to logout page
router.get("/logout", function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect("/login");
});


 


// authentication middleware
function checkAuthentication(req, res, next){
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged into see this page");
    res.redirect("/login");
  }
};



module.exports = router;