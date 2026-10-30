const router = require('express').Router();
const authenticateToken = require('../middlewares/auth');
const {requireAdmin,createSchedule,getBookings}=require('../controllers/adminController');
router.use(authenticateToken);
router.use(requireAdmin);
router.post('/schedules',createSchedule);
router.get('/bookings',getBookings);
module.exports=router;
