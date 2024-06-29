const mongoose = require("mongoose");
const {createHmac,randomBytes} =require("node:crypto");
const { createTokenForUser }= require('../services/authentication');
const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required:false,

    },
    email:{
        type: String,
        required: true,
        unique: true,
        
    },
    salt:{
        type:String,
        
    },
    password:{
        type: String,
        required:true,
        
        
    },
    profileimageurl :{
        type:String,
        default:"/images/profile.png",
    },
    role :{
        type:String,
        enum: ["USER","ADMIN"],
        default:"USER",
    }
},{timestamps:true});
userSchema.pre("save", function(next){
    const user =this;
    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex");
    this.salt=salt;
    this.password =hashedPassword;
    next();
})
userSchema.static('matchpasswordAndCreateToken',async function(email,password) {
    const user = await this.findOne({email});
    if(!user) throw new Error('user not found');
    const salt=user.salt;
    const hashedpassword = user.password;
    const userProvideHash = createHmac("sha256",salt)
    .update(password)
    .digest("hex");
    if(hashedpassword !== userProvideHash) throw new Error('Incorrect password');
    const token = createTokenForUser(user);
    return token;
    
})
const User = mongoose.model("user",userSchema);
module.exports = User;
