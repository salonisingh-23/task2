const express= require('express');
const mongoose = require('mongoose');
const path=require('path');
// const hbs=require('hbs');
const ejs=require('ejs');
require("./db/conn");
const Article = require('./models/articles')
const methodOverride = require('method-override');
const articleRouter = require('./../routes/articles')

const Register=require('./models/registers');

const app=express();
app.use(methodOverride('_method'))

// app.set("view engine","hbs");
app.set("view engine","ejs");
app.set('views', path.join(__dirname, '../views'));

const static_path=path.join(__dirname,'../public');
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// console.log(path.join(__dirname,'../public'));






app.get("/",(req,res)=>{
    res.render("index");
})


app.get("/forget",(req,res)=>{
    res.render("forget");
})


app.post("/forget",async(req,res)=>{
    try{
            const username=req.body.username;
            const newPassword=req.body.newPassword;
            const cPassword=req.body.confirmPassword;
            // const details=await Register.findOne({username:username});
            if(newPassword===cPassword){
                await Register.findOneAndUpdate({username:username},{$set:{password:newPassword}});
                
                
                // prompt("Password Changed");
            }
            else{
                res.send("New Password did not match Confirm Password");
            }
            res.render('index');
    }
    catch(err){

        console.log(err);
    }
})
app.get("/register",(req,res)=>{
    res.render("register");
})

// app.get("/home",(req,res)=>{
//     res.render('index.ejs');
// })

app.use('/articles', articleRouter)


app.get('/articles', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
  })

app.post("/articles",async(req,res)=>{

    

    // res.render('posts/home',{posts:posts})
    try{
            const username=req.body.sign_username;
            const password=req.body.sign_password;

            const uname=await Register.findOne({username:username});

            console.log(uname);
            if(uname.password===password){

                const articles = await Article.find().sort({ createdAt: 'desc' })
                res.render('articles/index', { articles: articles })
                // res.status(201).render("articles/index");
                // res.render("articles/index.ejs",{posts:posts});
            }
            else{
                res.send("<h1>Password/username did not match</h1>");
            }
    }
    catch(error){
            res.send("invalid username/password");
        }
    
})

app.post("/register",async(req,res)=>{
    try{
        // const name=req.body.name;
        // const email=req.body.email;
        // const username=req.body.username;
        // const password=req.body.password;

        const registerEmployee=new Register({
             
            name:req.body.name,
            email:req.body.email,
            username:req.body.username,
            password:req.body.password
             
        })
        const registered=await registerEmployee.save();
        res.status(201).render("register");
        
    }catch(error){
        res.status(400).send(error);
    }
})



// app.post('/home/new',async(req,res)=>{
//     const post=new Post({
//         title:req.body.title,
//         description:req.body.description
//     })



//     try{
//     await post.save();
//     const posts=Post.find().toArray();  
    
    
//     // const posts={
//     //     title:postDetails.title,
//     //     createdAt: postDetails.createdAt,
//     //     description:postDetails.description
//     // }
//     res.render('posts/home.ejs',{posts:posts});
//     }
//     catch(e){
//         res.send(e);
        
//     }
// })





app.listen(3000 || process.env.PORT, ()=>{
    console.log("server running at 3000");
})