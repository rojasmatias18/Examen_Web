const adminService = require('../services/adminService');
const httpError = require('../utils/httpError');
const asyncHandler = require('../utils/asyncHandler');
function requireAdmin(req,res,next){if(req.user.role!=='ADMIN') return next(httpError(403,'Acceso solo para ADMIN'));next();}
const createSchedule=asyncHandler(async(req,res)=>res.status(201).json(await adminService.createSchedule(req.body)));
const getBookings=asyncHandler(async(req,res)=>res.json(await adminService.getBookings()));
module.exports={requireAdmin,createSchedule,getBookings};
