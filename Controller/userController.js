const userModel = require("../Model/userModel")
const validator = require('../util/validator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

//POST /register
const createUser = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })

        }

        //extract params
        let { name, phone, email, password, role } = requestBody;

        //validation starts
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: `name is required` })
        };


        if (!validator.isValid(phone)) {
            if (!(/^\(?([1-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)))
                return res.status(400).send({ status: false, message: 'phone no is required' })

        };

        const isPhoneAlreadyUsed = await userModel.findOne({ phone: phone }); //{phone: phone} object shorthand property
        if (isPhoneAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${phone} phone number is already registered` })

        };

        email = email.trim().toLowerCase()
        if (!validator.isValid(email)) {
            if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)))
                return res.status(400).send({ status: false, message: `Email is required` })
        };

        const isEmailAlreadyUsed = await userModel.findOne({ email: email });
        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} email address is already registered` })
        };

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: `Password is required` })
        };

        if (!(password.length > 7 && password.length < 16)) {
            return res.status(400).send({ status: false, message: "password should  between 8 and 15 characters" })
        };

        if (!validator.isValid(role)) {
            return res.status(400).send({ status: false, message: `please provide your role between ${['guest', 'admin', 'superadmin']} this` })
        };



        const userDetails = { name, phone, email, password, role };
        const salt = await bcrypt.genSalt(10);
        userDetails.password = await bcrypt.hash(userDetails.password, salt)

        const newUser = await userModel.create(userDetails);
        res.status(201).send({ status: true, message: ` success`, data: newUser });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    };
}



// login
const login = async function (req, res) {
    try {

        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'value in request body is required' })
        }

        let email = req.body.email
        let password = req.body.password

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` })
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: 'password must be present' })
        }

        if (email && password) {

            let User = await userModel.findOne({ email: email })

            const passvalid = await bcrypt.compare(password, User.password)
            const Token = jwt.sign({userId: User._id,}, "urSpace")
            res.header('x-api-key', Token)

            res.status(200).send({ status: true, msg: "User login successfull", data: { userId: User._id, Token: Token } })
        } else {
            res.status(400).send({ status: false, Msg: "Invalid Credentials" })
        }

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { createUser, login }

