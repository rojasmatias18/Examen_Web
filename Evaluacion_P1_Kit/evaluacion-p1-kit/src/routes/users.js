const router=require('express').Router();
const authenticateToken=require('../middlewares/auth');
const authorizeUser=require('../middlewares/authorizeUser');
const {listByUser}=require('../controllers/bookingController');
router.get('/:id/bookings',authenticateToken,authorizeUser,listByUser);
module.exports=router;
