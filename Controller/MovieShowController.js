const moviewModel = require("../Model/MovieShowModel")
const validator = require('../util/validator')
const userModel = require('../Model/userModel')

//POST 
const createShow = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
        }

        //extract params
        let {title,language,theatreId,duration,seatCategories} = requestBody;

        //validation starts
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: `title is required` })
        };
        if (!validator.isValid(language)) {
            return res.status(400).send({ status: false, message: `language provide your role between ${['guest', 'admin', 'superadmin']} this` })
        };
        if (!validator.isValidObjectId(theatreId)) {
            return res.status(400).send({ status: false, message: `theatreId provide your role between ${['guest', 'admin', 'superadmin']} this` })
        };
        if (!validator.isValid(duration)) {
            return res.status(400).send({ status: false, message: `duration provide your role between ${['guest', 'admin', 'superadmin']} this` })
        };
        if (!validator.isValid(seatCategories)) {
            return res.status(400).send({ status: false, message: `seatCategories provide your role between ${['guest', 'admin', 'superadmin']} this` })
        };

         const isAdmin = await userModel.findOne({role:"admin"});

        const Details = {title,language,theatreId,duration,seatCategories};
        if (isAdmin) {

        const newMovie = await moviewModel.create(Details);
        res.status(201).send({ status: true, message: ` success`, data: newMovie });
        }else{
         return res.status(400).send({ status: false, message: `admin only allowed` })

        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    };
}


const DeleteMovie = async function (req, res) {
    try {
       
        let moviewId = req.query.moviewId

        if (!validator.isValidObjectId(moviewId)) {
            return res.status(400).send({ status: false, message: `moviewId is wrong`})
        };
            let tempdata = await moviewModel.findOneAndUpdate({_id:moviewId,isDeleted: false }, { isDeleted: true},{ new: true })
            if (tempdata) {
                res.status(200).send({status:true,data:tempdata})
            } else {
                res.status(404).send({ err: "data might have been already deleted" })
            }
       
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = {createShow,DeleteMovie}
