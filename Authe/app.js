const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


/*
app.use(cookieParser());

app.get("/", function(req, res){
    res.cookie("Name", "Monauwarul");
    res.send("Done");
})

app.get("/read", function(req, res){
    console.log( req.cookies);
    res.send("read page"); // you can find cookies also here bcz cookies with every route.
})
*/
 /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Encrpytion
// app.get("/", function(req, res){
//     bcrypt.genSalt(10, function(err, salt) {
//         bcrypt.hash("Password", salt, function(err, hash) {
//             console.log(hash);
//         });
//     });
// })

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ decryption or compare

// app.get("/", function(req, res){
//     bcrypt.compare("password", "$2b$10$cRy73ZC7AAkqsOESkftCCuK1vHGQmfJm/TaQExTs44Z26H9hQ6TDC", function(err, result) {
//         // result == true
//         console.log(result);
//     });
// })

// ```````````````````````````````````````````````````````````JWT`````````````````````````````````````````````````````````
app.use(cookieParser());
app.get("/", function(req, res){
   let token = jwt.sign({email:"mannu@gmail.com"}, "secretkey");
   res.cookie("token", token);
   res.send('done');
});
app.get("/read", function(req, res){
//    console.log(req.cookies.token);
    let data = jwt.verify(req.cookies.token, "secretkey");
    console.log(data);
});

app.listen(3000);