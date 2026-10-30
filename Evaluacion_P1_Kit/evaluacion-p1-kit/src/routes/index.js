const router=require('express').Router();
router.use('/auth',require('./auth'));
router.use('/admin',require('./admin'));
router.use('/bookings',require('./bookings'));
router.use('/users',require('./users'));
module.exports=router;
