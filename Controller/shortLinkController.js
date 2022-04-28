const shortcutModel = require("../Model/shortcut.js")
const userModel = require('../Model/userModel')
const shortid = require('shortid');
const baseUrl = 'http://localhost:3000'

//checking requestbody is empty or not
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

//created a shortcut url
const createUrl = async function (req, res) {
    try {
        let decodedUserToken = req.user;
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
        }

        //Authentication
        if (!(decodedUserToken.userId === requestBody.userId)) {
            return res.status(400).send({ status: false, message: "token id or user id not matched" });
        }

        if (!(Object.keys(req.body).length > 0)) { // Checking Body is not Empty
            res.status(400).send("No Url Found...!!")
        }

        //const longUrl = req.body.longUrl.trim();
        //console.log(longUrl)
        var { userId, description, longUrl, tags } = req.body


        //validation start
        if (!/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(longUrl)) {
            if (!/(.com|.org|.co.in|.in|.co|.us)/.test(longUrl))
                return res.status(400).send({ status: false, message: `This is not a valid Url` });
        }
        if ((longUrl.includes("https://") && longUrl.match(/https:\/\//g).length !== 1) ||
            (longUrl.includes("http://") && longUrl.match(/http:\/\//g).length !== 1) ||
            (longUrl.includes("ftp://") && longUrl.match(/ftp:\/\//g).length !== 1)) {
            return res.status(400).send({ status: false, msg: "Url is not valid" });
        }

        //validation end
        const urlToken = shortid.generate();//generate short urlcode
        let checkUrl = await shortcutModel.findOne({ longUrl: longUrl })
        if (checkUrl) {
            return res.send({ message: " You already created Short Url for this Long Url :", data: checkUrl })
        } else {
            const shortlink = baseUrl + '/' + urlToken;
            const isshortlinkAlreadyUsed = await shortcutModel.findOne({ shortlink });

            if (isshortlinkAlreadyUsed) {
                return res.status(400).send({ status: false, message: `${shortlink} shortlink is already registered` })
            }

            const storedData = { shortlink, userId, description, longUrl, tags }
            let savedData = await shortcutModel.create(storedData)
            res.status(200).send({ status: true, data: savedData })
        }

    } catch (e) {
        res.status(500).send(e.message);
    }
}


const getAllshortcuts = async function (req, res) {
    try {
        const userId = req.params.userId
        let decodedUserToken = req.user;

        if (!(decodedUserToken.userId === userId)) {
            return res.status(400).send({ status: false, message: "token id or user id not matched" });
        }

        let userDetail = await userModel.findOne({ _id: userId })

        let shortcutData = await shortcutModel.find({ userId: userDetail }).select({ _id: 1, userId: 1, description: 1, shortlink: 1, longUrl: 1, tags: 1 }).sort({ description: 1 })

        let data = {
            _id: userDetail._id,
            name: userDetail.name,
            email: userDetail.email,
            password: userDetail.password,
            shortcutData: shortcutData
        }

        if (shortcutData.length == 0) { res.status(200).send({ status: true, message: "shortcutData List", data: data }) }

        let SortedDiscription = shortcutData.sort(function (a, b) { return a.createdAt > b.createdAt && 1 })
        res.status(200).send({ status: true, message: 'list', data: data })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}



const Deleteshortcut = async function (req, res) {
    try {
        let decodedUserToken = req.user;
        if (decodedUserToken.userId == req.query.userId) {
            let info = req.query
            let userbody = await shortcutModel.findOne(info)
            let tempdata = await shortcutModel.findOneAndUpdate({ id: userbody._id, isDeleted: false }, { isDeleted: true, deletedAt: Date() }, { new: true })
            if (tempdata) {
                res.status(200).send({ status: true, data: tempdata })
            } else {
                res.status(404).send({ err: "data might have been already deleted" })
            }
        } else {
            res.status(404).send({ err: "you are trying to access a different's user account" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const filtershortcut = async function (req, res) {
    try {
        let body = req.query;
        body.isDeleted = false;

        let foundshortcut = await shortcutModel.find(body);
        if (foundshortcut) {
            res.status(200).send({ status: true, data: foundshortcut });
        }
        else {
            res.status(404).send({ status: false, msg: "No documents found" });
        }
    }
    catch (err) {
        res.status(500).send({ msg: "Some error occured" });
    }
}

module.exports = { createUrl, getAllshortcuts, Deleteshortcut, filtershortcut }