const httpError=require('../utils/httpError');
const {parseId}=require('../services/bookingService');
module.exports=(req,res,next)=>{try{const id=parseId(req.params.id);if(req.user.role!=='ADMIN'&&req.user.id!==id)throw httpError(403,'No tienes permiso para ver estas reservas');next();}catch(error){next(error);}};
