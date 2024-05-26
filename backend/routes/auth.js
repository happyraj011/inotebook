const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser')
const router=express.Router();
const JWT_SECERT='harryisgoodboy';
const {body,validation, validationResult}=require('express-validator')

//Route 1: Create a user using "/api/auth/createuser". No login required
router.post('/createuser',[
    body('name','Enter a vaild name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','password must be atlest 5 character').isLength({min:5})
],async(req,res)=>{
 const errors=validationResult(req);
 if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})

 }
 try {
 let user=await User.findOne({email:req.body.email});
 if (user){
    return res.status(400).json({error:"sorry a user with this email already exits"})
 }
 const salt =await bcrypt.genSaltSync(10);
 const secPass= await bcrypt.hashSync(req.body.password, salt);

 
 user=await User.create({
    name:req.body.name,
    password:secPass,
    email:req.body.email,
 });
 const data={
    user:{
        id:user.id
    }
 }
const authtoken=jwt.sign(data,JWT_SECERT);
res.json({authtoken})


} catch (error) {
    console.error(error.message)
    res.status(500).send("some error occured")
}
})









//Route 2: Authentication a user using "/api/auth/login"
router.post('/login',[
   
    body('email','Enter a valid email').isEmail(),
    body('password','password cannot be blank').exists(),
   
],async(req,res)=>{

    const errors=validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()})
   
    }
    const {email,password}=req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"please try to login with correct credentials"});
        }
        const data={
            user:{
                id:user.id
            }
         }
        const authtoken=jwt.sign(data,JWT_SECERT);
        res.json({authtoken})
       
    } catch (error) {
        console.error(error.message)
    res.status(500).send("internal server error occured")
        
    }
})





//Route 3: get loggedin user Details  using "/api/auth/getuser". login required
router.post('/getuser',fetchuser,async(req,res)=>{
try {
    userId=req.user.id
    const user=await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message)
    res.status(500).send("internal server error occured")
        
}
})
module.exports=router
