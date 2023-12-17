var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');
const postModel = require("./post");
const localStrategy = require('passport-local');
const upload = require('./multer');

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed', isLoggedIn, async function(req, res) {
  const posts = await postModel.find().populate("user");
  res.render('feed', {footer: true, posts});
});

router.get('/profile', isLoggedIn, async function(req, res) {
  const user = await  userModel.findOne({username: req.session.passport.user}).populate("posts");
  res.render('profile', {footer: true , user});
});

router.get('/search', function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user})
  res.render('edit', {footer: true, user});
});

router.get('/upload', isLoggedIn, function(req, res) {
  res.render('upload', {footer: true});
});

router.get('/username/:username', async function(req, res) {
  const regex = new RegExp(`^${req.params.username}`, 'i');
  const users = await userModel.find({username: regex});
  res.json(users)
});

router.post('/register', function(req, res) {
   const userData = userModel ({
    username: req.body.username,
    // password: req.body.password, pass it below not here
    email: req.body.email,
    name: req.body.name,
   })
   userModel.register(userData, req.body.password)
   .then(function(){
      passport.authenticate("local")(req,res,function(){
        res.redirect("/profile")
      })
   })  
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  }), function(req, res){ 
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
// create loggedin function to check if user is logged in, use this function as middleware to protect routes
// write isLoggedIn inside a route to protect it
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

router.post("/update", isLoggedIn, upload.single('image'), async function(req, res, next){
  const user = await userModel.findOneAndUpdate(
    {username: req.session.passport.user},
    {username: req.body.username,
     name: req.body.name,
    bio: req.body.bio},
    {new: true})
    
    if(req.file){
      user.profileImage = req.file.filename; //updating the picture
    }
    await user.save(); //you have to write this line in order to save the details
    res.redirect("/profile");
  })


router.post("/upload", upload.single("image"), async function(req,res,next){
   const user = await userModel.findOne({username: req.session.passport.user})
   const post = await postModel.create({
     picture: req.file.filename,
     user: user._id,
     caption: req.body.caption
   })

    user.posts.push(post._id);
    await user.save();
    res.redirect("/feed");
})

module.exports = router;
