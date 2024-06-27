const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/miniproject", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  age: Number,
  password: String,
  posts: [  
    {
      type: mongoose.Schema.Types.ObjectId, ref: "post"
    }
  ],
});

module.exports = mongoose.model('user', userSchema);
