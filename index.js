
const express =require("express");
const path = require("path");
const UserRoute =require('./routes/user');
const blogRoute =require('./routes/blog');
const mongoose =require("mongoose");
const cookieparser = require("cookie-parser");
const Blog = require('./models/blog');
const { CheckForAuthenticationCookie } = require("./middlewares/authenticaton");
const { error } = require("console");
const app = express();
const PORT = 8000;

mongoose.connect('mongodb+srv://vivek:vivek990942@blogify.c4uuwvo.mongodb.net/?retryWrites=true&w=majority&appName=Blogify')
.then(e => console.log('Mongodb connected'))
.catch((error)=>{
    console.log(error);
})
app.set("view engine","ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
app.use(CheckForAuthenticationCookie("token"));
//app.use(express.static(path.resolve("./public")));
app.use(express.static(path.resolve('./public')));



app.get("/",async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
    
})
app.use("/user",UserRoute);
app.use("/blog",blogRoute);
app.listen(PORT,() =>{
    console.log(`server started at port${PORT}`);
})