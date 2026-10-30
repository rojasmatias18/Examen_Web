const asyncHandler=require('../utils/asyncHandler');
const httpError=require('../utils/httpError');
const {getBooking}=require('../services/bookingService');
module.exports=asyncHandler(async(req,res,next)=>{const booking=await getBooking(req.params.id);if(req.user.role!=='ADMIN'&&booking.userId!==req.user.id)throw httpError(403,'No tienes permiso sobre esta reserva');req.booking=booking;next();});
