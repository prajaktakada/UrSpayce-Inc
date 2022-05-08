const theatreModel = require("../Model/Theatre")
const moviewModel = require("../Model/MovieShowModel")
const validator = require('../util/validator')

//POST /register
const createTheatre = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
        }

        //extract params
        let {theatrename,address} = requestBody;

        //validation starts
        if (!validator.isValid(theatrename)) {
            return res.status(400).send({ status: false, message: `theatrename is required` })
        };

        if (!validator.isValid(address)) {
            return res.status(400).send({ status: false, message: `address provide your role between ${['guest', 'admin', 'superadmin']} this` })
        };

        const Details = {theatrename,address};
        
        const newtheatre = await theatreModel.create(Details);
        res.status(201).send({ status: true, message: ` success`, data: newtheatre });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    };
}


// GET 
const getAlltheatre = async function (req, res) {
        try {
            let body = req.query;
            body.isDeleted = false;
            let found= await theatreModel.find(body);
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



module.exports = {createTheatre,getAlltheatre}

