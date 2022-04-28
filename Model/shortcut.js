const mongoose = require('mongoose')

const shortcutSchema = new mongoose.Schema({

    shortlink:{type: String,required: true,unique:true},
    userId:{type: mongoose.Types.ObjectId,ref: 'user',required: true,unique:true},
    description:{type: String,required: true},
    longUrl:{type: String,required: true,unique:true},//valid
    tags:{type: String,required: true},
    isDeleted:{type: Boolean,default: false}
     },{ timestamps: true })

module.exports = mongoose.model('shortcut', shortcutSchema)