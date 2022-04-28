const userModel = require("../Model/userModel")
const jwt = require("jsonwebtoken")
//let exporter = process.exporter;


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const resisterUser = async function (req, res) {
    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
        }

        //extract params
        let { name, email, password } = requestBody;

        //validation starts
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid name' })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
        }
        if (!(password.trim().length > 7 && password.trim().length < 16)) {
            return res.status(400).send({ status: false, message: ' Please provide valid password' })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid password' })
        }

        const userData = { name, email, password }

        let saveduser = await userModel.create(userData)
        res.status(201).send({ status: true, data: saveduser })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



// login
const login = async function (req, res) {
    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'value in request body is required' })
        }

        let email = req.body.email
        let password = req.body.password

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'password must be present' })
        }

        if (email && password) {

            let User = await userModel.findOne({ email: email })

            const Token = jwt.sign({ userId: User._id, exp: Math.floor(Date.now() / 1000) + 30 * 60 }, "pk")

            //
            // Creating Cookie for Auth
            res.cookie('jwt', Token, {
                expires: new Date(Date.now() + process.env.JWT_TOKEN),
                // secure:true,
                httpOnly: true,
            })


            logout = (req, res) => {
                res.clearCookie('jwt')
                res.clearCookie('user')

            }
            //
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



module.exports = { resisterUser, login }

