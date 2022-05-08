
const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidUser = function (value) {
    let avilable = ['guest', 'admin']
    value = value.split(",")
    for (let x of value) {
        if (avilable.includes(x) == false) {
            return false
        }
    }
    return true;
}

module.exports = {isValidRequestBody,isValid,isValidObjectId,isValidUser}