const moviewModel = require("../Model/MovieShowModel")
const validator = require('../util/validator')
const MSeatsModel = require('../Model/MSeats')
const userModel = require('../Model/userModel')

//POST 
const createSeat = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
        }

        //extract params
        let {Seat_No,movieId,Stype,available} = requestBody;

        if (!validator.isValid(Seat_No)) {
            return res.status(400).send({ status: false, message: `Seat_No is required` })
        };

        // if (!(Seat_No < 1 || Seat_No >= 50)) {
        //     return res.status(400).send({ status: false, message: `Seat_No should  between 1 and 50` })
        // };

        if (!validator.isValidObjectId(movieId)) {
            return res.status(400).send({ status: false, message: `movieId is required` })
        };

        if (!validator.isValid(Stype)) {
            return res.status(400).send({ status: false, message: `enter type of seat is required` })
        };

        
        Stype = Stype.trim().toLowerCase()

         const isAdmin = await userModel.findOne({role:"admin"});
        //  console.log(isAdmin)
        var moviePresent = await moviewModel.findOne({_id:req.body.movieId})
        //  console.log(moviePresent)
        if(!moviePresent){
           return res.status(400).send({ status: false, message: `Invalid request parameters. ${movieId} is not presnt` })
        }

        const isSeat_NoAlreadyUsed = await MSeatsModel.findOne({Seat_No:Seat_No}); //{Seat_No: Seat_No} object shorthand property
        if (isSeat_NoAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${Seat_No} Seat_No number is already registered` })

        };

        const seatDetails = {Seat_No,movieId,Stype,available};

        if (isAdmin) {

        const seats = await MSeatsModel.create(seatDetails);
        res.status(201).send({ status: true, message: `success`, data:seats});
            
        }else{
         return res.status(400).send({ status: false, message: `admin only allowed` })

        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    };
}



const getAllsheats = async function (req, res) {
    try {
        // let body = req.query;
        // body.isDeleted = false;
        let found= await MSeatsModel.find();
        if (found) {
            res.status(200).send({ status: true, data: found });
        }
        else {
            res.status(404).send({ status: false, msg: "No documents found" });
        }
    }
    catch (err) {
        res.status(500).send({ msg: "Some error occured" });
    }
}




//GEt/booked seats
const bookedSeats = async function (req, res) {
    try {
        const moviewId = req.params.moviewId
       
        let moviewDetail = await moviewModel.findOne({ _id: moviewId })

        findBookedSeat = await MSeatsModel.findOne({movieId:moviewId,available:false})
        // console.log(findBookedSeat)
        if(!findBookedSeat){
            return res.status(400).send({ status: false, message: `not available` })
        }
        let seatData = await MSeatsModel.find({ movieId:moviewId }).select({ _id: 1, Seat_No: 1, Stype: 1})

        

        let data = {
            _id: moviewDetail._id,
            title: moviewDetail.title,
            language: moviewDetail.language,
            theatreId: moviewDetail.theatreId,
            seatCategories: moviewDetail.seatCategories,
            duration: moviewDetail.duration,
            seatData: seatData
        }

        if (seatData.length == 0) { res.status(200).send({ status: true, message: "seatData List", data: data }) }

        res.status(200).send({ status: true, message: 'list', data: data })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

//GET 
const AvailableSeats = async function (req, res) {
    try {
        const moviewId = req.params.moviewId
       
        let moviewDetail = await moviewModel.findOne({ _id: moviewId })

        let seatData = await MSeatsModel.find({ movieId:moviewId }).select({ _id: 1, Seat_No: 1, Stype: 1, available: true})

        let data = {
            _id: moviewDetail._id,
            title: moviewDetail.title,
            language: moviewDetail.language,
            theatreId: moviewDetail.theatreId,
            seatCategories: moviewDetail.seatCategories,
            duration: moviewDetail.duration,
            seatData: seatData
        }

        if (seatData.length == 0) { res.status(200).send({ status: true, message: "seatData List", data: data }) }

        res.status(200).send({ status: true, message: 'list', data: data })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}


module.exports = {createSeat,getAllsheats,AvailableSeats,bookedSeats}
