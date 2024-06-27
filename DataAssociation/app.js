const express = require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/posts");

app.get("/", function (req, res) {
  res.send("hey");
});

app.get("/create", async function (req, res) {
  let user = await userModel.create({
    username: "mannu",
    email: "mannu@gmail.com",
    age: 20,
  });
  res.send(user);
});

app.get("/createpost", async function (req, res) {
  let post = await postModel.create({
    postdata: "Hello Dataassociation",
    user: "6669f0adb5d2e5206fbfdd16",
  });

  let user = await userModel.findOne({ _id: "6669f0adb5d2e5206fbfdd16" });
  user.posts.push(post._id);
  await user.save();
  res.send({post, user});
});

app.listen(3000);
