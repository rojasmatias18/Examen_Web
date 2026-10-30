const {registerUser,loginUser}=require('../services/authService');
const asyncHandler=require('../utils/asyncHandler');
const register=asyncHandler(async(req,res)=>{await registerUser(req.body.email,req.body.password,req.body.name);res.status(201).json({message:'User registered successfully'});});
const login=asyncHandler(async(req,res)=>res.json({token:await loginUser(req.body.email,req.body.password)}));
module.exports={register,login};
