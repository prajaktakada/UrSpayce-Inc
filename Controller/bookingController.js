const userModel = require("../Model/userModel")
const validator = require('../util/validator')
const ticketModel = require('../Model/TicketModel')
const bookingModel = require('../Model/bookingModel')



const booking = async function (req, res) {
    try {
        const requestBody = req.body;
        // console.log(requestBody)
        let decodedUserToken = req.user;
        // console.log(decodedUserToken)

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
        }
// console.log(decodedUserToken.userId)
// console.log(requestBody.userId)

        if (!(decodedUserToken.userId === requestBody.userId)) {
            return res.status(400).send({ status: false, message: "token id or user id not matched" });
        }

        //extract params
        let {userId,ticketId} = requestBody;

    

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `userId is required` })
        };

        if (!validator.isValidObjectId(ticketId)) {
            return res.status(400).send({ status: false, message: `ticketId is required` })
        }
    

        var userPresent = await userModel.findOne({_id:req.body.userId})
    
        if(!userPresent){
           return res.status(400).send({ status: false, message: `Invalid request parameters. ${userId} is not presnt` })
        }

        var ticketPresent = await ticketModel.findOne({_id:req.body.ticketId})
    
        if(!ticketPresent){
           return res.status(400).send({ status: false, message: `Invalid request parameters. ${ticketId} is not presnt` })
        }
         let Details = {userId,ticketId};
       
        const ticket = await bookingModel.create(Details);
        
        res.status(201).send({ status: true, message: `success`, data:ticket});
            
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    };
}
module.exports = {booking}
