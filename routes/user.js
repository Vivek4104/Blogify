const {Router} = require("express");
const User = require('../models/user');
const router =Router();
router.get("/signin" , (req,res) =>{
    return res.render("signin");
});
router.get("/signup" , (req,res) =>{
    return res.render("signup");
});
router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        await User.create({
            fullName,
            email,
            password,
        });
        return res.redirect("/");
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(400).send("Email address is already in use");
        }
        // Handle other errors as needed
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.post("/signin",async(req,res) =>{
    const {email,password} = req.body;
    try {
        
        const token =await  User.matchpasswordAndCreateToken(email,password);
        return res.cookie("token",token).redirect("/");
    } catch (error) {
        return res.render("signin",{
            error: "Incorrect Email or Password",
        });
       
    }
   
});
router.get('/logout',(req,res)=>{ 
    res.clearCookie("token").redirect("/");
})
module.exports =router;