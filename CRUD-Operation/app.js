const express = require("express");
const app = express();
const path = require('path');
const userModel = require('./models/user');

/*


// Basic CRUD operation
app.get('/', (req, res) =>{
 res.send('hey');
})

const userModel = require("./userModel");
app.get("/create", async (req, res) => {
  let createduser = await userModel.create({
    name: "Monu",
    username: "monu123",
    gmail: "monu@gmail,com",
  });

  res.send(createduser);
});

app.get("/update", async (req, res) => {
  let updateduser = await userModel.findOneAndUpdate(
    { name: "Mannu" },
    { username: "Monauwarul" },
    { new: true }
  );

  res.send(updateduser);
});
app.get("/read", async (req, res) => {
  let user = await userModel.find();
  res.send(user);
});

app.get("/delete", async (req, res) => {
  let deleteduser = await userModel.findOneAndDelete({username:'mannu123'});
  res.send(deleteduser);
});
*/

// CRUD in EJS

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req, res) => {
  res.render('index');
})
app.get('/read', async (req, res) => {
  let allUser = await userModel.find();
  res.render('read', {users : allUser});
})
app.get('/delete/:id', async (req, res) => {
  let allUser = await userModel.findOneAndDelete({_id: req.params.id});
  res.redirect('/read');
})
app.get('/edit/:userid', async (req, res) => {
  let user = await userModel.findOne({_id: req.params.userid});
  res.render('edit',{user});
})
app.post('/update/:userid', async (req, res) => {
  let {name, email,image} = req.body;
  let user = await userModel.findOneAndUpdate({_id: req.params.userid}, {
    name : name,
    email : email,
    imageUrl : image,
   }, {new: true});
  res.redirect('/read');
})
app.post('/create', async (req, res) => {
   let {name, email,image} = req.body;
   let createduser = await userModel.create({
    name : name,
    email : email,
    imageUrl : image,
   });
   res.redirect('/read');
}) 

app.listen(3000);
