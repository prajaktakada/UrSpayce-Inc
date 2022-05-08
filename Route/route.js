const express = require('express');
const router = express.Router();

 const userController=require("../Controller/userController")
 const TheatreController = require('../Controller/TheatreController')
 const showController = require('../Controller/MovieShowController')
 const SeatsController = require('../Controller/SeatsController')
 const ticketController = require('../Controller/ticketController')
 const bookingController = require('../Controller/bookingController')
 
 const Middleware = require('../Middleware/Auth')

  router.post('/User',userController.createUser)
  router.post('/login',userController.login)

  router.post('/createTheatre',TheatreController.createTheatre)
  router.get('/getAlltheatre',TheatreController.getAlltheatre)

  router.post('/admin/movies/show',showController.createShow)
  router.delete('/DeleteMovie',showController.DeleteMovie)

   router.post('/admin/movies/seat',SeatsController.createSeat)
   router.get('/getAllsheats',SeatsController.getAllsheats)
   router.get('/movies/Allseat/:moviewId',SeatsController.AvailableSeats)
   router.get('/movies/bookedSeats/:moviewId',SeatsController.bookedSeats)

   router.post('/moview/Ticket',ticketController.createTicket)

   router.post('/ticket/booking',Middleware.Auth,bookingController.booking)
//Tickets /seats/:seatId/book
module.exports = router;


