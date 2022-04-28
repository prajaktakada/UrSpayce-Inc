//required mongoose package to define the schema
const mongoose = require('mongoose')
//defined schema for user document
const userSchema = new mongoose.Schema({

    name: {type: String,required: true},
    password: {type: String,required: true},
    email: {type: String,required: true,unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    }

    },{ timestamps: true })

module.exports = mongoose.model('user', userSchema)