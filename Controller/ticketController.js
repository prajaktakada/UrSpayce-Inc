const moviewModel = require("../Model/MovieShowModel")
const validator = require('../util/validator')
const MSeatsModel = require('../Model/MSeats')
const ticketModel = require('../Model/TicketModel')

//POST 
const createTicket = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
        }

        //extract params
        let {movieId,seatId,price} = requestBody;

        if (!validator.isValidObjectId(movieId)) {
            return res.status(400).send({ status: false, message: `movieId is required` })
        };

        if (!validator.isValidObjectId(seatId)) {
            return res.status(400).send({ status: false, message: `seatNo is required` })
        }
    
        var moviePresent = await moviewModel.findOne({_id:req.body.movieId})
        //  console.log(moviePresent)
        if(!moviePresent){
           return res.status(400).send({ status: false, message: `Invalid request parameters. ${movieId} is not presnt` })
        }

        var seatPresent = await MSeatsModel.findOne({_id:req.body.seatId,available:true})
         if(!seatPresent){
           return res.status(400).send({ status: false, message: `Invalid request parameters. ${seatNo} is not presnt` })
        }

        price= moviePresent.seatCategories.price
        console.log(price)
         let ticketDetails = {movieId,seatId,price:price};
       
         const ticket = await ticketModel.create(ticketDetails)
         
         setTimeout(function(){
        res.status(201).send({ status: true, message: `success`, data:ticket});
    }, Math.floor(Date.now() / 1000) + 10 * 60 * 60); //valid  time on or after NOT be accepted for processing.   (abhi ke time se 10 ganta tak jalee gha ) Date.now() / 1000=> seconds + 60x60min i.e 1hr and x10 gives 10hrs.
            
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    };
}
module.exports = {createTicket}
