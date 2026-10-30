const prisma=require('../utils/prisma');
const httpError=require('../utils/httpError');
const include={schedule:true};
function parseId(id){const value=Number(id);if(!Number.isSafeInteger(value)||value<1)throw httpError(400,'ID inválido');return value;}
function parseDate(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value))throw httpError(400,'Fecha inválida');const date=new Date(value.length===10?`${value}T00:00:00.000Z`:value);if(isNaN(date.getTime()))throw httpError(400,'Fecha inválida');return date;}
async function validateSchedule(id){const schedule=await prisma.schedule.findUnique({where:{id}});if(!schedule)throw httpError(404,'Horario no encontrado');return schedule;}
async function checkOccupied(date,scheduleId,exceptId){const found=await prisma.booking.findFirst({where:{date,scheduleId,...(exceptId?{id:{not:exceptId}}:{})}});if(found)throw httpError(400,'El horario ya está ocupado');}
async function createBooking(body,userId){const scheduleId=parseId(body.scheduleId),date=parseDate(body.date);await validateSchedule(scheduleId);await checkOccupied(date,scheduleId);return prisma.booking.create({data:{date,userId,scheduleId},include});}
async function getBooking(id){const booking=await prisma.booking.findUnique({where:{id:parseId(id)},include});if(!booking)throw httpError(404,'Reserva no encontrada');return booking;}
async function updateBooking(id,body){const bookingId=parseId(id),scheduleId=parseId(body.scheduleId),date=parseDate(body.date);await validateSchedule(scheduleId);await checkOccupied(date,scheduleId,bookingId);return prisma.booking.update({where:{id:bookingId},data:{date,scheduleId},include});}
async function deleteBooking(id){await prisma.booking.delete({where:{id:parseId(id)}});}
async function getUserBookings(id){return prisma.booking.findMany({where:{userId:parseId(id)},include,orderBy:{id:'asc'}});}
module.exports={parseId,createBooking,getBooking,updateBooking,deleteBooking,getUserBookings};
