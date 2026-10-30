const service=require('../services/bookingService');
const asyncHandler=require('../utils/asyncHandler');
const create=asyncHandler(async(req,res)=>res.status(201).json(await service.createBooking(req.body,req.user.id)));
const get=asyncHandler(async(req,res)=>res.json(req.booking));
const update=asyncHandler(async(req,res)=>res.json(await service.updateBooking(req.params.id,req.body)));
const remove=asyncHandler(async(req,res)=>{await service.deleteBooking(req.params.id);res.status(204).end();});
const listByUser=asyncHandler(async(req,res)=>res.json(await service.getUserBookings(req.params.id)));
module.exports={create,get,update,remove,listByUser};
