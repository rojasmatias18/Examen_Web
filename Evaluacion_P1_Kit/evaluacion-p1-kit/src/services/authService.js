const prisma=require('../utils/prisma');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {isValidEmail}=require('../utils/validation');
const httpError=require('../utils/httpError');
async function registerUser(email,password,name){
 if(typeof name!=='string'||!name.trim()||typeof password!=='string'||!password||!isValidEmail(email))throw httpError(400,'Datos de registro inválidos');
 email=email.trim().toLowerCase();
 if(await prisma.user.findUnique({where:{email}}))throw httpError(400,'El correo ya está registrado');
 try{return await prisma.user.create({data:{name:name.trim(),email,password:await bcrypt.hash(password,10),role:'USER'},select:{id:true,name:true,email:true,role:true}});}catch(e){if(e.code==='P2002')throw httpError(400,'El correo ya está registrado');throw e;}
}
async function loginUser(email,password){
 const error=()=>httpError(400,'Invalid email or password');
 if(typeof email!=='string'||typeof password!=='string')throw error();
 const user=await prisma.user.findUnique({where:{email:email.trim().toLowerCase()}});
 if(!user||!await bcrypt.compare(password,user.password))throw error();
 return jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'4h'});
}
module.exports={registerUser,loginUser};
