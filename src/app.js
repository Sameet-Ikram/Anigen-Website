const express= require ("express");
const mongoose=require("mongoose");
const path=require("path");
const hbs=require("hbs");
const app=express();
const User=require("./models/register");
const { check, validationResult } = require('express-validator');
mongoose
  .connect('mongodb://127.0.0.1:27017/mydatabase')
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })
const port=process.env.PORT || 3000;
const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get('/',(req,res)=>{
  res.render("index");
});
app.get('/Register',(req,res)=>{
  res.render("Register");
});
app.get('/Login',(req,res)=>{
  res.render("login");
});
app.get('/home',(req,res)=>{
  res.render("home");
});
app.get('/About',(req,res)=>{
  res.render("About");
});
app.get('/Avatar',(req,res)=>{
  res.render("Avatar");
});
app.get('/Text',(req,res)=>{
  res.render("TextToSpeech");
});
app.get('/Voice',(req,res)=>{
  res.render("CloneVoice");
});

//Creating a new user in database
app.post('/Register',async (req,res)=>{
  try{
    const password=req.body.pswd;
    const c_password=req.body.c_pswd;
    if(password===c_password){
      const registerUser= new User({
        name:req.body.txt,
        email:req.body.email,
        password:req.body.pswd
      })
      const registered=await registerUser.save();
      res.status(201).render("index");

    }
    else{
      throw("Password mismatched");
      // res.send("Password and confirmed password are not a match");
    }
  }
  catch (error){
    res.status(400).send(error);
  }
});
app.post('/Login',async(req,res)=>{
  try{
    const email=req.body.email;
    const password=req.body.pswd;
    const userEmail=await User.findOne({email:email});

    if(userEmail.password===password){
      res.status(201).render("home");
    }
    else{
      throw("Password mismatched");
      // res.send("Incorrect Password");
    }

  }
  catch (error){
  throw("Password mismatched");
    // res.status(400).send("Invalid Email");
  }


});

app.listen(port,()=>{
  console.log('Server is running at port no ' + port);
})
