const express = require("express");
const app = express();
const userModel = require("./model/user");
const postModel = require("./model/post");
const cookieparser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("./config/multerconfig");
const path = require("path");


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieparser());



app.get("/", function (req, res) {
  res.render("index");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.post("/post", isLoggedin, async function (req, res) {
    let email = req.user.email;  // Use req.user set by isLoggedin middleware
    let {content} = req.body;
    let user = await userModel.findOne({ email });
    let post = await postModel.create({
      user  : user._id,
      content : content,
    })

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
});

app.get("/like/:id", isLoggedin, async function (req, res) {  
  let post = await postModel.findOne({ _id : req.params.id }).populate("user");
  if(post.likes.indexOf(req.user.userid) === -1){
    post.likes.push(req.user.userid);
  }
  else{
    post.likes.splice(post.likes.indexOf(req.user.userid),1);
  }
  await post.save();
  res.redirect("/profile");
});

app.get("/edit/:id", isLoggedin, async function (req, res) {  
  let post = await postModel.findOne({ _id : req.params.id }).populate("user");
  res.render("edit", {post});
});

app.post("/update/:id", isLoggedin, async function (req, res) {  
  let post = await postModel.findOneAndUpdate({ _id : req.params.id }, {content :req.body.content});
 
  res.redirect("/profile");
});


app.get("/profile", isLoggedin, async function (req, res) {
    let email = req.user.email;  // Use req.user set by isLoggedin middleware

    let user = await userModel.findOne({ email }).populate("posts");
    res.render("profile", { user });
});

app.post("/register", async function (req, res) {
  let { username, name, email, age, password } = req.body;

  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("User Already register");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        username,
        name,
        email,
        age,
        password: hash,
      });

      let token = jwt.sign({email:email, userid: user._id, }, "shhhh");
      res.cookie("token", token);
      res.send("Registered");

    });
  });
});

// Multer 
app.get("/profile/upload", function (req, res) {
  res.render("uploadfile");
});
app.post("/upload", isLoggedin, upload.single("image"), async function (req, res) {
  let user = await userModel.findOne({email: req.user.email});
  user.profilepic = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

app.post("/login", async function (req, res) {
  let {email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) return res.status(500).send("Email and Password is wrong");

  bcrypt.compare(password, user.password, (err, result) => {
    if(result) {
       
    let token = jwt.sign({email:email, userid: user._id, }, "shhhh");
      res.cookie("token", token);
      res.status(200).redirect("/profile");
    }
    else res.redirect("/login");
    
  })
});

app.get("/logout", function (req, res) {
    res.cookie("token", "");
    res.redirect("/login");
  });

  function isLoggedin(req, res, next){
    if(req.cookies.token === "") res.redirect("/login");
    else{
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data;
        next();
    }
    
  }
  
app.listen(3000);
